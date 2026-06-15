from app.database import SessionLocal
from app.models import Product

RESTOCK_THRESHOLD = 400
RESTOCK_AMOUNT = 1000

def restock_products():
    db = SessionLocal()

    try:
        products = (
            db.query(Product)
            .filter(Product.stock < RESTOCK_THRESHOLD)
            .all()
        )

        if not products:
            print("No products need restocking.")
            return

        for product in products:
            old_stock = product.stock
            product.stock = RESTOCK_AMOUNT

            print(
                f"Restocked {product.name} "
                f"from {old_stock} -> {product.stock}"
            )

        db.commit()

    except Exception as e:
        db.rollback()
        print(f"Restock failed: {e}")

    finally:
        db.close()