"""
Tests the GET /products endpoint.
"""


def test_get_products_returns_all_products(client):
    response = client.get("/products")

    assert response.status_code == 200

    body = response.json()

    assert body["count"] == 2
    assert len(body["data"]) == 2
    assert body["data"][0]["name"] == "Test Shirt"
