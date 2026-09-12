import requests

BASE_URL = "http://localhost:3000"
ADMIN_LOGIN_PATH = "/api/admin/login"
ADMIN_PRODUCTS_PATH = "/api/admin/products"
ADMIN_PASSWORD = "postform-admin-2026"
TIMEOUT = 30

def test_get_api_admin_products_requires_authentication():
    session = requests.Session()
    
    # Attempt to GET /api/admin/products without authentication
    url_products = BASE_URL + ADMIN_PRODUCTS_PATH
    resp_unauth = session.get(url_products, timeout=TIMEOUT)
    assert resp_unauth.status_code == 401, f"Expected 401 for unauthenticated request, got {resp_unauth.status_code}"
    try:
        json_unauth = resp_unauth.json()
        assert json_unauth.get("error") == "UNAUTHORIZED", f"Expected error UNAUTHORIZED, got {json_unauth}"
    except Exception as e:
        assert False, f"Response is not valid JSON or missing error field: {e}"

    # Authenticate via POST /api/admin/login with valid password
    login_url = BASE_URL + ADMIN_LOGIN_PATH
    login_payload = {"password": ADMIN_PASSWORD}
    login_resp = session.post(login_url, json=login_payload, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Admin login failed with status {login_resp.status_code}"
    assert "pf_admin" in login_resp.cookies, "pf_admin session cookie not set after login"
    
    # Authenticated GET /api/admin/products
    auth_resp = session.get(url_products, timeout=TIMEOUT)
    assert auth_resp.status_code == 200, f"Authenticated GET /api/admin/products returned {auth_resp.status_code}"
    try:
        data = auth_resp.json()
    except Exception as e:
        assert False, f"Authenticated response JSON decode error: {e}"
    assert "products" in data, "Response JSON missing 'products' field"
    products = data["products"]
    assert isinstance(products, list), f"'products' should be a list, got {type(products)}"
    
    # Check each product structure: must have images and variants as per requirements
    for product in products:
        assert "images" in product, "Product missing 'images' field"
        assert isinstance(product["images"], list), "'images' should be a list"
        assert "variants" in product, "Product missing 'variants' field"
        assert isinstance(product["variants"], list), "'variants' should be a list"
        
        # Optional: check images have url field
        for img in product["images"]:
            assert "url" in img and isinstance(img["url"], str) and img["url"], "Image missing or invalid 'url'"

        # Optional: check variants have 'stock' and optional size,color
        for variant in product["variants"]:
            assert "stock" in variant and (isinstance(variant["stock"], int) or isinstance(variant["stock"], float)), \
                "Variant missing or invalid 'stock' field"

test_get_api_admin_products_requires_authentication()