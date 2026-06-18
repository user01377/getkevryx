from app.database import SessionLocal
from app.models import Product

# all amounts are based on category
RESTOCK_THRESHOLD = {
    "top": 125,
    "bottom": 125,
    "outerwear": 75,
    "accessory": 75
}

RESTOCK_AMOUNT = {
    "top": 600,
    "bottom": 600,
    "outerwear": 300,
    "accessory": 200
}

def restock_products():
    db = SessionLocal()

    try:
        products = db.query(Product).all()

        changed = False

        for product in products:
            category = product.category.value

            threshold = RESTOCK_THRESHOLD.get(category)
            restock_amount = RESTOCK_AMOUNT.get(category)

            if product.stock < threshold:
                old_stock = product.stock
                product.stock = restock_amount

                print(
                    f"Restocked {product.name} "
                    f"({category}) {old_stock} -> {product.stock}"
                )

                changed = True

        if changed:
            db.commit()
        else:
            print("No products need restocking.")

    except Exception as e:
        db.rollback()
        print(f"Restock failed: {e}")

    finally:
        db.close()