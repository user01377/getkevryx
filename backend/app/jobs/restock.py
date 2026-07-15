import logging
from app.database import SessionLocal
from app.models import Product

RESTOCK_THRESHOLD = {"top": 125, "bottom": 125, "outerwear": 75, "accessory": 75}
RESTOCK_AMOUNT = {"top": 600, "bottom": 500, "outerwear": 300, "accessory": 200}

logger = logging.getLogger(__name__)


def restock_products():
    logger.info("Starting restock job")

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

                logger.info(
                    "Restocked %s (%s): %s -> %s",
                    product.name,
                    category,
                    old_stock,
                    product.stock,
                )

                changed = True

        if changed:
            db.commit()
            logger.info("Restock complete")
        else:
            logger.info("No products need restocking")

    except Exception:
        db.rollback()
        logger.exception("Restock failed")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )

    restock_products()
