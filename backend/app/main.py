import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from contextlib import asynccontextmanager
from app.routes import router
from app.database import Base, engine
from app import models, seed

def wait_for_db(engine, retries=10):
    for i in range(retries):
        try:
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
                return
        except Exception:
            print("db unresponsive, retrying..")
            time.sleep(2 ** i)

    raise Exception("DB offline")

@asynccontextmanager
async def lifespan(app: FastAPI):
    wait_for_db(engine)
    
    print("Creating tables..")
    Base.metadata.create_all(bind=engine)

    print("seeding database..")
    seed.seed_products()

    yield

    # add shutdown logic here


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",    # Common for local React/Vue development
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)