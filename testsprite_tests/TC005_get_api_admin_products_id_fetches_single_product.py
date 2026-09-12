import requests

BASE_URL = "http://localhost:3000"
ADMIN_PASSWORD = "postform-admin-2026"
TIMEOUT = 30

def test_get_api_admin_products_id_fetches_single_product():
    session = requests.Session()
    # Admin login
    login_resp = session.post(
        f"{BASE_URL}/api/admin/login",
        json={"password": ADMIN_PASSWORD},
        timeout=TIMEOUT
    )
    assert login_resp.status_code == 200, f"Login failed with status {login_resp.status_code}"
    # The session cookie pf_admin should now be stored in session.cookies

    created_product_id = None
    try:
        # Step 1: Create a new product to have a known valid product ID
        product_payload = {
            "name": "Test Product for TC005",
            "category": "test-category",
            "price": 19.99,
            "tags": ["test", "tc005"],
            "images": [{"url": "http://example.com/image.jpg", "alt": "Example image"}],
            "variants": [{"size": "M", "color": "red", "stock": 10}]
        }
        create_resp = session.post(
            f"{BASE_URL}/api/admin/products",
            json=product_payload,
            timeout=TIMEOUT
        )
        assert create_resp.status_code == 201, f"Product creation failed with status {create_resp.status_code}"
        created_product = create_resp.json().get("product")
        assert created_product, "Created product JSON missing 'product'"
        created_product_id = created_product.get("id")
        assert created_product_id, "Created product missing 'id'"

        # Step 2: GET the product by valid ID and verify success
        get_resp = session.get(
            f"{BASE_URL}/api/admin/products/{created_product_id}",
            timeout=TIMEOUT
        )
        assert get_resp.status_code == 200, f"GET product by ID failed with status {get_resp.status_code}"
        product = get_resp.json().get("product")
        assert product, "GET product response missing 'product'"
        assert product["id"] == created_product_id, "Returned product id does not match requested id"
        # Verify essential fields exist
        assert isinstance(product.get("tags"), list), "Product tags is not a list"
        assert "images" in product, "Product missing images"
        assert "variants" in product, "Product missing variants"

        # Step 3: GET product by non-existent ID and verify 404 NOT_FOUND
        invalid_id = "00000000-0000-0000-0000-000000000000"  # UUID unlikely to exist
        get_invalid_resp = session.get(
            f"{BASE_URL}/api/admin/products/{invalid_id}",
            timeout=TIMEOUT
        )
        assert get_invalid_resp.status_code == 404, f"Expected 404 for non-existent product ID but got {get_invalid_resp.status_code}"
        error_json = get_invalid_resp.json()
        assert error_json.get("error") == "NOT_FOUND", "Expected error NOT_FOUND for missing product id"

    finally:
        # Cleanup: delete the created product if exists
        if created_product_id:
            session.delete(
                f"{BASE_URL}/api/admin/products/{created_product_id}",
                timeout=TIMEOUT
            )

test_get_api_admin_products_id_fetches_single_product()