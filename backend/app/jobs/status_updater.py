from datetime import datetime, timezone, timedelta

from app.database import SessionLocal
from app.models import OrderPlaced, OrderStatus

SHIPPED_TIME = 2
OUT_FOR_DELIVERY_TIME = 5
FULFILLED_TIME = 10


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

                print(f"Order #{order.id}: {old_status} -> {new_status}")

                changed = True

        if changed:
            db.commit()

    except Exception as e:
        db.rollback()
        print(f"Order update failed: {e}")

    finally:
        db.close()
