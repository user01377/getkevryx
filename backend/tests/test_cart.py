"""
Tests the all /cart endpoints.
"""

from decimal import Decimal

def test_empty_cart(client):
    response = client.get("/cart")

    assert response.status_code == 200
    assert response.json()["items"] == []

def test_add_to_cart(client):
    response = client.post(
        "/cart/add",
        json={
            "product_id": 1,
            "quantity": 2,
        },
    )

    assert response.status_code == 200

    body = response.json()

    assert body["product_id"] == 1
    assert body["quantity"] == 2

def test_get_cart_after_add(client):
    client.post(
        "/cart/add",
        json={
            "product_id": 1,
            "quantity": 2,
        },
    )

    response = client.get("/cart")

    assert response.status_code == 200

    items = response.json()["items"]

    assert len(items) == 1

    assert items[0]["quantity"] == 2
    assert items[0]["product"]["name"] == "Test Shirt"

def test_add_existing_item_increases_quantity(client):
    client.post(
        "/cart/add",
        json={
            "product_id": 1,
            "quantity": 2,
        },
    )

    client.post(
        "/cart/add",
        json={
            "product_id": 1,
            "quantity": 3,
        },
    )

    response = client.get("/cart")

    items = response.json()["items"]

    assert len(items) == 1
    assert items[0]["quantity"] == 5

def test_add_invalid_product(client):
    response = client.post(
        "/cart/add",
        json={
            "product_id": 999,
            "quantity": 1,
        },
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"

def test_add_invalid_quantity(client):
    response = client.post(
        "/cart/add",
        json={
            "product_id": 1,
            "quantity": 0,
        },
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Quantity must be > 0"

def test_add_multiple_products(client):
    client.post(
        "/cart/add",
        json={
            "product_id": 1,
            "quantity": 2,
        },
    )

    client.post(
        "/cart/add",
        json={
            "product_id": 2,
            "quantity": 1,
        },
    )

    response = client.get("/cart")

    items = response.json()["items"]

    assert len(items) == 2

    assert items[0]["product"]["name"] == "Test Shirt"
    assert items[1]["product"]["name"] == "Test Hoodie"

def test_empty_cart_summary(client):
    response = client.get("/cart/summary")

    assert response.status_code == 200

    summary = response.json()

    assert summary["items"] == []
    assert Decimal(summary["subtotal"]) == Decimal("0")
    assert Decimal(summary["shipping"]) == Decimal("0")
    assert Decimal(summary["tax"]) == Decimal("0")
    assert Decimal(summary["total"]) == Decimal("0")

def test_cart_summary(client):
    client.post(
        "/cart/add",
        json={"product_id": 1, "quantity": 2},
    )

    client.post(
        "/cart/add",
        json={"product_id": 2, "quantity": 1},
    )

    response = client.get("/cart/summary")

    assert response.status_code == 200

    summary = response.json()

    assert Decimal(summary["subtotal"]) == Decimal("100.00")
    assert Decimal(summary["shipping"]) == Decimal("12.2000")
    assert Decimal(summary["tax"]) == Decimal("8.150000")
    assert Decimal(summary["total"]) == Decimal("120.350000")

def test_update_cart_item(client):
    client.post(
        "/cart/add",
        json={"product_id": 1, "quantity": 2},
    )

    response = client.patch(
        "/cart/item/1",
        json={"quantity": 5},
    )

    assert response.status_code == 200

    cart = client.get("/cart").json()

    assert cart["items"][0]["quantity"] == 5

def test_update_invalid_quantity(client):
    client.post(
        "/cart/add",
        json={"product_id": 1, "quantity": 2},
    )

    response = client.patch(
        "/cart/item/1",
        json={"quantity": 11},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid Quantity"

def test_update_nonexistent_item(client):
    client.post(
        "/cart/add",
        json={"product_id": 1, "quantity": 2},
    )

    response = client.patch(
        "/cart/item/999",
        json={"quantity": 2},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Cart item not found"

def test_delete_cart_item(client):
    client.post(
        "/cart/add",
        json={"product_id": 1, "quantity": 2},
    )

    response = client.delete("/cart/item/1")

    assert response.status_code == 200

    cart = client.get("/cart").json()

    assert cart["items"] == []

def test_delete_nonexistent_item(client):
    client.post(
        "/cart/add",
        json={"product_id": 1, "quantity": 2},
    )

    response = client.delete("/cart/item/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Item not found in cart"