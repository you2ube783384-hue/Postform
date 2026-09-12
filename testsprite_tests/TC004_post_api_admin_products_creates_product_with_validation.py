import requests
from requests.exceptions import RequestException

BASE_URL = "http://localhost:3000"
ADMIN_LOGIN_PATH = "/api/admin/login"
ADMIN_PRODUCTS_PATH = "/api/admin/products"
ADMIN_PASSWORD = "postform-admin-2026"
TIMEOUT = 30

def test_post_api_admin_products_creates_product_with_validation():
    session = requests.Session()
    try:
        # Admin login
        login_resp = session.post(
            BASE_URL + ADMIN_LOGIN_PATH,
            json={"password": ADMIN_PASSWORD},
            timeout=TIMEOUT
        )
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        assert 'pf_admin' in login_resp.cookies.get_dict(), "pf_admin cookie not set on login"

        headers = {
            "Content-Type": "application/json"
        }

        # 1. Test successful creation with required fields, images, and variants
        product_payload = {
            "name": "Test Product TC004",
            "category": "test-category",
            "price": 99.99,
            "brand": "TestBrand",
            "description": "Test product description",
            "tags": ["test", "tc004"],
            "images": [
                {"url": "https://example.com/image1.jpg", "alt": "Front view"},
                {"url": "https://example.com/image2.jpg"}
            ],
            "variants": [
                {"size": "M", "color": "Red", "stock": 10},
                {"size": "L", "color": "Blue", "stock": 5}
            ]
        }

        create_resp = session.post(
            BASE_URL + ADMIN_PRODUCTS_PATH,
            json=product_payload,
            headers=headers,
            timeout=TIMEOUT
        )
        assert create_resp.status_code == 201, f"Product creation failed: {create_resp.text}"
        created_product = create_resp.json().get("product")
        assert created_product, "Response missing product key"
        assert created_product.get("name") == product_payload["name"]
        assert created_product.get("category") == product_payload["category"]
        assert abs(created_product.get("price", 0) - product_payload["price"]) < 0.001
        # tags returned as JSON array
        assert isinstance(created_product.get("tags"), list)
        # images and variants are present and correct count
        assert isinstance(created_product.get("images"), list)
        assert len(created_product["images"]) == len(product_payload["images"])
        assert isinstance(created_product.get("variants"), list)
        assert len(created_product["variants"]) == len(product_payload["variants"])
        created_product_id = created_product.get("id")
        assert created_product_id, "Created product missing id"

        # Validate errors for various invalid inputs

        # Helper to test invalid payload and assert 400 with error VALIDATION (or specific)
        def post_product_assert_error(payload, expected_status=400, expected_error=None):
            resp = session.post(
                BASE_URL + ADMIN_PRODUCTS_PATH,
                json=payload,
                headers=headers,
                timeout=TIMEOUT
            )
            assert resp.status_code == expected_status, f"Expected status {expected_status} but got {resp.status_code}: {resp.text}"
            try:
                resp_json = resp.json()
            except Exception:
                assert False, "Response is not valid JSON"
            if expected_error:
                assert resp_json.get("error") == expected_error, f"Expected error '{expected_error}' but got '{resp_json.get('error')}'"
            else:
                assert "error" in resp_json, "Expected error in response"

        # Missing required field 'name'
        invalid_payload = product_payload.copy()
        invalid_payload.pop("name")
        post_product_assert_error(invalid_payload, expected_status=400, expected_error="VALIDATION")

        # Missing required field 'category'
        invalid_payload = product_payload.copy()
        invalid_payload.pop("category")
        post_product_assert_error(invalid_payload, expected_status=400, expected_error="VALIDATION")

        # Missing required field 'price'
        invalid_payload = product_payload.copy()
        invalid_payload.pop("price")
        post_product_assert_error(invalid_payload, expected_status=400, expected_error="VALIDATION")

        # Invalid price (negative)
        invalid_payload = product_payload.copy()
        invalid_payload["price"] = -10
        post_product_assert_error(invalid_payload, expected_status=400, expected_error="VALIDATION")

        # Invalid image URL (malformed URL)
        invalid_payload = product_payload.copy()
        invalid_payload["images"] = [{"url": "htp://bad-url"}]
        post_product_assert_error(invalid_payload, expected_status=400, expected_error="VALIDATION")

        # Variant with negative stock
        invalid_payload = product_payload.copy()
        invalid_payload["variants"] = [{"size": "M", "stock": -1}]
        post_product_assert_error(invalid_payload, expected_status=400, expected_error="VALIDATION")

        # Variant with non-integer stock (float)
        invalid_payload = product_payload.copy()
        invalid_payload["variants"] = [{"size": "M", "stock": 5.5}]
        post_product_assert_error(invalid_payload, expected_status=400, expected_error="VALIDATION")

        # Variant missing stock (optional? The schema doesn't say required but if required test)
        # Since "stock" is required in variant according to schema, test missing stock
        invalid_payload = product_payload.copy()
        invalid_payload["variants"] = [{"size": "M"}]
        post_product_assert_error(invalid_payload, expected_status=400, expected_error="VALIDATION")

        # Duplicate slug: POST should auto-uniquify slug, so create with same slug explicit to test
        dup_slug_name = "Test Product TC004"
        create_resp_dup = session.post(
            BASE_URL + ADMIN_PRODUCTS_PATH,
            json={**product_payload, "slug": "test-product-tc004"},
            headers=headers,
            timeout=TIMEOUT
        )
        assert create_resp_dup.status_code == 201, f"Duplicate slug creation failed: {create_resp_dup.text}"
        product_dup = create_resp_dup.json().get("product")
        assert product_dup, "Response missing product key for duplicate slug creation"
        assert product_dup.get("slug") != "test-product-tc004", "Slug not uniquified on duplicate slug creation"

    finally:
        # Cleanup created product(s)
        # Delete original created product
        cookies = session.cookies.get_dict()
        pf_admin_cookie = cookies.get("pf_admin")
        if created_product_id and pf_admin_cookie:
            try:
                del_resp = session.delete(
                    f"{BASE_URL}{ADMIN_PRODUCTS_PATH}/{created_product_id}",
                    timeout=TIMEOUT
                )
                # 200 expected
                assert del_resp.status_code == 200, f"Failed to delete created product id={created_product_id}"
            except RequestException:
                pass
        # Also cleanup duplicate slug product if created
        if 'product_dup' in locals() and product_dup and "id" in product_dup:
            try:
                del_resp = session.delete(
                    f"{BASE_URL}{ADMIN_PRODUCTS_PATH}/{product_dup['id']}",
                    timeout=TIMEOUT
                )
                assert del_resp.status_code == 200, f"Failed to delete duplicate-slug product id={product_dup['id']}"
            except RequestException:
                pass


test_post_api_admin_products_creates_product_with_validation()