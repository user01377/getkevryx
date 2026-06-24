import json
from app.database import SessionLocal
from app.models import Product

# this path only works inside docker containers
FIXTURE_PATH = "./app/fixtures/data.json"
# FIXTURE_PATH = "./app/fixtures/stress-test.json"

def load_products():
    with open(FIXTURE_PATH, "r") as file:
        return json.load(file)

def seed_products():
    db = SessionLocal()

    try:
        products = load_products()

        for product_data in products:

            existing_product = db.query(Product).filter(Product.name == product_data["name"]).first()

            if existing_product:
                print(f"Skipping existing product: {product_data['name']}")
                continue

            product = Product(**product_data)

            db.add(product)

        db.commit()

        print("Database seeded successfully.")

    except Exception as e:
        db.rollback()
        print(f"Seeding failed: {e}")
    
    finally:
        db.close()

if __name__ == "__main__":
    seed_products()