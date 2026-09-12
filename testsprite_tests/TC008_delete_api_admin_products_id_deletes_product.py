import requests

BASE_URL = "http://localhost:3000"
ADMIN_PASSWORD = "postform-admin-2026"
LOGIN_URL = f"{BASE_URL}/api/admin/login"
PRODUCTS_URL = f"{BASE_URL}/api/admin/products"
TIMEOUT = 30


def test_delete_api_admin_products_id_deletes_product():
    session = requests.Session()

    # Login to get auth cookie
    login_resp = session.post(
        LOGIN_URL,
        json={"password": ADMIN_PASSWORD},
        timeout=TIMEOUT,
    )
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    assert "pf_admin" in session.cookies.get_dict(), "pf_admin cookie not set"

    # Create a new product to delete
    product_payload = {
        "name": "Test Delete Product",
        "category": "TestCategory",
        "price": 123.45,
        "tags": ["delete", "test"],
        "images": [{"url": "http://example.com/image1.jpg", "alt": "Image 1"}],
        "variants": [
            {"size": "M", "color": "Red", "stock": 10},
            {"size": "L", "color": "Blue", "stock": 5},
        ],
    }
    create_resp = session.post(
        PRODUCTS_URL,
        json=product_payload,
        timeout=TIMEOUT,
    )
    assert create_resp.status_code == 201, f"Product creation failed: {create_resp.text}"
    product = create_resp.json().get("product")
    assert product is not None, "Created product missing in response"
    product_id = product.get("id")
    assert product_id, "Created product ID missing"

    try:
        # Delete the created product
        delete_resp = session.delete(
            f"{PRODUCTS_URL}/{product_id}",
            timeout=TIMEOUT,
        )
        assert delete_resp.status_code == 200, f"Delete failed: {delete_resp.text}"
        delete_json = delete_resp.json()
        assert delete_json.get("ok") is True, "Delete response 'ok' is not True"

        # Verify product is deleted by fetching it (should 404)
        get_resp = session.get(
            f"{PRODUCTS_URL}/{product_id}",
            timeout=TIMEOUT,
        )
        assert get_resp.status_code == 404, f"Deleted product still found: {get_resp.text}"

    finally:
        # Cleanup in case deletion failed - attempt delete again, ignore errors
        session.delete(f"{PRODUCTS_URL}/{product_id}", timeout=TIMEOUT)


test_delete_api_admin_products_id_deletes_product()