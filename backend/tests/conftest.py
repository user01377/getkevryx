import pytest
from decimal import Decimal

from fastapi.testclient import TestClient

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import create_app
from app.database import Base, get_db
from app.models import Product, ProductCategory


class APIPrefixClient(TestClient):
    def request(self, method, url, *args, **kwargs):
        if url.startswith("/"):
            url = "/api" + url

        return super().request(method, url, *args, **kwargs)


engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db():

    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    yield db

    db.close()

    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def seed_products(db):

    products = [
        Product(
            name="Test Shirt",
            description="A test shirt",
            slug="test-shirt",
            price=Decimal("25.00"),
            stock=10,
            category=ProductCategory.TOP,
        ),
        Product(
            name="Test Hoodie",
            description="A test hoodie",
            slug="test-hoodie",
            price=Decimal("50.00"),
            stock=5,
            category=ProductCategory.OUTERWEAR,
        ),
    ]

    db.add_all(products)
    db.commit()

    return db


@pytest.fixture(scope="function")
def client(seed_products):

    app = create_app(enable_lifespan=False)

    app.dependency_overrides[get_db] = override_get_db

    with APIPrefixClient(app) as client:
        yield client

    app.dependency_overrides.clear()
