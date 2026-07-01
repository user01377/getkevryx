"""
Tests the all /orders endpoint.
"""

from decimal import Decimal

def add_to_cart(client, product_id=1, quantity=2):
    return client.post(
        "/cart/add",
        json={
            "product_id": product_id,
            "quantity": quantity,
        },
    )


def checkout(client):
    return client.post(
        "/checkout",
        json={
            "first": "Test",
            "last": "User",
            "email": "test@example.com",
            "address": "123 Test St",
            "city": "Testville",
            "state": "TS",
            "zipcode": "12345",
        },
    )

def test_checkout_creates_order_and_persists_items(client):
    """
    This tests the full lifecycle of api
    """

    res = add_to_cart(client, product_id=1, quantity=2)
    assert res.status_code == 200

    res = checkout(client)
    assert res.status_code == 200

    data = res.json()

    assert "order_id" in data
    assert data["status"] == "created"
    assert data["total"] > 0

    order_id = data["order_id"]

    res = client.get(f"/order-summary/{order_id}")
    assert res.status_code == 200

    order = res.json()

    assert order["id"] == order_id
    assert len(order["items"]) == 1
    assert order["items"][0]["quantity"] == 2

    assert Decimal(order["subtotal"]) == Decimal("50.00")

def test_order_summary_not_found(client):
    res = client.get("/order-summary/9999")
    assert res.status_code == 404
    assert res.json()["detail"] == "Order not found"


def test_order_summary_math_consistency(client):
    """
    Ensures tax/shipping are applied consistently
    """

    add_to_cart(client, product_id=1, quantity=1)
    checkout_res = checkout(client)

    order_id = checkout_res.json()["order_id"]

    res = client.get(f"/order-summary/{order_id}")
    data = res.json()

    subtotal = Decimal(str(data["subtotal"]))
    shipping = Decimal(str(data["shipping"]))
    tax = Decimal(str(data["tax"]))
    total = Decimal(str(data["total"]))

    assert subtotal > 0
    assert shipping > 0
    assert tax > 0
    assert total == subtotal + shipping + tax

def test_order_info_returns_orders(client):
    """
    Creates an order then fetches via email
    """

    add_to_cart(client, product_id=1, quantity=1)
    checkout(client)

    res = client.post(
        "/order-info",
        json={"email": "test@example.com"},
    )

    assert res.status_code == 200

    orders = res.json()

    assert isinstance(orders, list)
    assert len(orders) >= 1

    order = orders[0]

    assert "id" in order
    assert Decimal(order["subtotal"]) > 0
    assert len(order["items"]) == 1


def test_order_info_empty_email_returns_empty(client):
    res = client.post(
        "/order-info",
        json={"email": "doesnotexist@example.com"},
    )

    assert res.status_code == 200
    assert res.json() == []


def test_checkout_requires_session(client):
    """
    New client without session behavior is handled internally
    """
    res = checkout(client)

    # API allows session creation via cart,
    # so this should fail because cart is empty
    assert res.status_code == 400


def test_checkout_empty_cart_fails(client):
    res = checkout(client)
    assert res.status_code == 400