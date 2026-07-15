from datetime import datetime, timezone, timedelta
import logging
from app.database import SessionLocal
from app.models import OrderPlaced, OrderStatus

SHIPPED_TIME = 2
OUT_FOR_DELIVERY_TIME = 5
FULFILLED_TIME = 10

logger = logging.getLogger(__name__)


def get_order_status(created_at):
    delta = datetime.now(timezone.utc) - created_at

    if delta >= timedelta(minutes=FULFILLED_TIME):
        return OrderStatus.FULFILLED
    elif delta >= timedelta(minutes=OUT_FOR_DELIVERY_TIME):
        return OrderStatus.OUT_FOR_DELIVERY
    elif delta >= timedelta(minutes=SHIPPED_TIME):
        return OrderStatus.SHIPPED

    return OrderStatus.PROCESSING


def update_order_status():
    logger.info("Starting order status update job")

    db = SessionLocal()

    try:
        orders = (
            db.query(OrderPlaced)
            .filter(OrderPlaced.order_status != OrderStatus.FULFILLED)
            .all()
        )

        changed = False

        for order in orders:
            new_status = get_order_status(order.created_at)

            old_status = order.order_status

            if old_status != new_status:
                order.order_status = new_status

                logger.info(
                    "Order #%s status updated: %s -> %s",
                    order.id,
                    old_status.value,
                    new_status.value,
                )

                changed = True

        if changed:
            db.commit()
            logger.info("Order status update complete")
        else:
            logger.info("No order statuses changed")

    except Exception:
        db.rollback()
        logger.exception("Order status update failed")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )

    update_order_status()
