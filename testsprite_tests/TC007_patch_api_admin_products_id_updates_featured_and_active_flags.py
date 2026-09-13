import requests

BASE_URL = "http://localhost:3000"
ADMIN_LOGIN_PATH = "/api/admin/login"
ADMIN_PRODUCTS_PATH = "/api/admin/products"
ADMIN_PASSWORD = "postform-admin-2026"
TIMEOUT = 30


def test_patch_api_admin_products_id_updates_featured_and_active_flags():
    session = requests.Session()
    # Authenticate admin and get session cookie
    login_resp = session.post(
        BASE_URL + ADMIN_LOGIN_PATH,
        json={"password": ADMIN_PASSWORD},
        timeout=TIMEOUT,
    )
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    assert "pf_admin" in login_resp.cookies.get_dict(), "No pf_admin session cookie set"

    created_product_id = None

    try:
        # Create a new product to test update on
        new_product_data = {
            "name": "Test Patch Featured Active Product",
            "category": "testing",
            "price": 99.99,
            "active": True,
            "featured": False,
            "images": [{"url": "http://example.com/image.jpg", "alt": "Test image"}],
            "variants": [{"stock": 10}],
        }
        create_resp = session.post(
            BASE_URL + ADMIN_PRODUCTS_PATH, json=new_product_data, timeout=TIMEOUT
        )
        assert create_resp.status_code == 201, f"Product creation failed: {create_resp.text}"
        product = create_resp.json().get("product")
        assert product and "id" in product, "Created product data missing id"
        created_product_id = product["id"]

        patch_url = f"{BASE_URL}{ADMIN_PRODUCTS_PATH}/{created_product_id}"

        # 1) Patch to update featured True only
        patch_payload = {"featured": True}
        patch_resp = session.patch(patch_url, json=patch_payload, timeout=TIMEOUT)
        assert patch_resp.status_code == 200, f"PATCH featured update failed: {patch_resp.text}"
        patched_product = patch_resp.json().get("product")
        assert patched_product and patched_product.get("featured") is True, "Featured flag not updated correctly"

        # 2) Patch to update active False only
        patch_payload = {"active": False}
        patch_resp = session.patch(patch_url, json=patch_payload, timeout=TIMEOUT)
        assert patch_resp.status_code == 200, f"PATCH active update failed: {patch_resp.text}"
        patched_product = patch_resp.json().get("product")
        assert patched_product and patched_product.get("active") is False, "Active flag not updated correctly"

        # 3) Patch to update both featured False and active True
        patch_payload = {"featured": False, "active": True}
        patch_resp = session.patch(patch_url, json=patch_payload, timeout=TIMEOUT)
        assert patch_resp.status_code == 200, f"PATCH both featured and active update failed: {patch_resp.text}"
        patched_product = patch_resp.json().get("product")
        assert patched_product and patched_product.get("featured") is False and patched_product.get("active") is True,\
            "Featured and active flags not updated correctly"

        # 4) Patch with empty payload triggers 400 NOTHING_TO_UPDATE
        patch_payload = {}
        patch_resp = session.patch(patch_url, json=patch_payload, timeout=TIMEOUT)
        assert patch_resp.status_code == 400, f"PATCH empty payload did not fail properly: {patch_resp.text}"
        error = patch_resp.json().get("error")
        assert error == "NOTHING_TO_UPDATE", f"Expected NOTHING_TO_UPDATE error, got: {error}"

        # 5) Patch with invalid fields also triggers 400 NOTHING_TO_UPDATE
        patch_payload = {"invalidField": True}
        patch_resp = session.patch(patch_url, json=patch_payload, timeout=TIMEOUT)
        assert patch_resp.status_code == 400, f"PATCH invalid fields did not fail properly: {patch_resp.text}"
        error = patch_resp.json().get("error")
        assert error == "NOTHING_TO_UPDATE", f"Expected NOTHING_TO_UPDATE error, got: {error}"

    finally:
        # Clean up (delete) the created product
        if created_product_id:
            del_resp = session.delete(
                f"{BASE_URL}{ADMIN_PRODUCTS_PATH}/{created_product_id}", timeout=TIMEOUT
            )
            assert del_resp.status_code == 200, f"Cleanup: Failed to delete product: {del_resp.text}"
            ok = del_resp.json().get("ok")
            assert ok is True, "Cleanup: Delete response not ok"


test_patch_api_admin_products_id_updates_featured_and_active_flags()