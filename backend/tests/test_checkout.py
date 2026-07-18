"""
Tests for /checkout endpoint
"""


def test_checkout_requires_session(client, seed_products):
    response = client.post(
        "/checkout",
        json={
            "first": "John",
            "last": "Doe",
            "email": "john@test.com",
            "address": "123 St",
            "city": "OKC",
            "state": "OK",
            "zipcode": "73101",
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Cart is empty"


def test_checkout_empty_cart(client, seed_products):
    session_id = "test-session"

    response = client.post(
        "/checkout",
        json={
            "first": "John",
            "last": "Doe",
            "email": "john@test.com",
            "address": "123 St",
            "city": "OKC",
            "state": "OK",
            "zipcode": "73101",
        },
        cookies={"session_id": session_id},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Cart is empty"


def test_checkout_success(client, seed_products):
    session_id = "test-session"

    # Add item to cart
    add_response = client.post(
        "/cart/add",
        json={
            "product_id": 1,
            "quantity": 2,
        },
        cookies={"session_id": session_id},
    )

    assert add_response.status_code == 200

    # Checkout
    response = client.post(
        "/checkout",
        json={
            "first": "John",
            "last": "Doe",
            "email": "john@test.com",
            "address": "123 St",
            "city": "OKC",
            "state": "OK",
            "zipcode": "73101",
        },
        cookies={"session_id": session_id},
    )

    assert response.status_code == 200

    data = response.json()

    assert "order_id" in data
    assert data["status"] == "created"
    assert data["total"] > 0


def test_checkout_clears_cart(client, seed_products):
    session_id = "test-session"

    client.post(
        "/cart/add",
        json={"product_id": 1, "quantity": 1},
        cookies={"session_id": session_id},
    )

    client.post(
        "/checkout",
        json={
            "first": "John",
            "last": "Doe",
            "email": "john@test.com",
            "address": "123 St",
            "city": "OKC",
            "state": "OK",
            "zipcode": "73101",
        },
        cookies={"session_id": session_id},
    )

    cart = client.get(
        "/cart",
        cookies={"session_id": session_id},
    )

    assert cart.status_code == 200
    assert cart.json()["items"] == []


def test_checkout_insufficient_stock(client, seed_products):
    session_id = "test-session"

    # Try to exceed stock (product 2 has stock=5 in your seed)
    client.post(
        "/cart/add",
        json={"product_id": 2, "quantity": 999},
        cookies={"session_id": session_id},
    )

    response = client.post(
        "/checkout",
        json={
            "first": "John",
            "last": "Doe",
            "email": "john@test.com",
            "address": "123 St",
            "city": "OKC",
            "state": "OK",
            "zipcode": "73101",
        },
        cookies={"session_id": session_id},
    )

    assert response.status_code == 400


def test_checkout_creates_order_id(client, seed_products):
    session_id = "test-session"

    client.post(
        "/cart/add",
        json={"product_id": 1, "quantity": 1},
        cookies={"session_id": session_id},
    )

    response = client.post(
        "/checkout",
        json={
            "first": "John",
            "last": "Doe",
            "email": "john@test.com",
            "address": "123 St",
            "city": "OKC",
            "state": "OK",
            "zipcode": "73101",
        },
        cookies={"session_id": session_id},
    )

    assert response.status_code == 200

    order_id = response.json()["order_id"]

    # verify order exists via summary endpoint
    order = client.get(f"/order-summary/{order_id}")

    assert order.status_code == 200
    assert order.json()["id"] == order_id
