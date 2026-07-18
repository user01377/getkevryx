"""
Tests the GET /products endpoint.
"""

from decimal import Decimal


def test_get_products(client):
    response = client.get("/products")

    assert response.status_code == 200

    body = response.json()

    assert body["count"] == 2
    assert len(body["data"]) == 2

    assert body["data"][0]["name"] == "Test Shirt"
    assert body["data"][1]["name"] == "Test Hoodie"


def test_get_single_product(client):
    response = client.get("/products/test-shirt")

    assert response.status_code == 200

    product = response.json()

    assert product["id"] == 1
    assert product["name"] == "Test Shirt"
    assert Decimal(product["price"]) == Decimal("25.00")


def test_get_invalid_product(client):
    response = client.get("/products/999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Product not found"
