def test_security_headers(client):
    response = client.get("/products")

    assert response.status_code == 200

    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"
    assert response.headers["Referrer-Policy"] == "strict-origin-when-cross-origin"
    assert (
        response.headers["Permissions-Policy"]
        == "geolocation=(), camera=(), microphone=()"
    )
