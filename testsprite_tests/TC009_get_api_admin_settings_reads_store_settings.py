import requests

BASE_URL = "http://localhost:3000"
ADMIN_LOGIN_PATH = "/api/admin/login"
ADMIN_SETTINGS_PATH = "/api/admin/settings"
ADMIN_PASSWORD = "postform-admin-2026"
TIMEOUT = 30


def test_get_api_admin_settings_reads_store_settings():
    session = requests.Session()
    login_url = BASE_URL + ADMIN_LOGIN_PATH
    settings_url = BASE_URL + ADMIN_SETTINGS_PATH

    # Attempt unauthenticated GET - should be rejected with 401
    response_unauth = session.get(settings_url, timeout=TIMEOUT)
    assert response_unauth.status_code == 401, f"Expected 401 for unauthenticated request, got {response_unauth.status_code}"
    try:
        json_unauth = response_unauth.json()
        assert "error" in json_unauth and json_unauth["error"] == "UNAUTHORIZED", f"Expected error UNAUTHORIZED in unauth response, got {json_unauth}"
    except Exception:
        # Sometimes response body might be empty or not JSON, still code must be 401.
        pass

    # Authenticate admin
    login_payload = {"password": ADMIN_PASSWORD}
    login_headers = {"Content-Type": "application/json"}
    login_resp = session.post(login_url, json=login_payload, headers=login_headers, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Admin login failed with status {login_resp.status_code}"
    # Should have pf_admin session cookie set
    cookies = login_resp.cookies.get_dict()
    assert "pf_admin" in cookies, "pf_admin session cookie not set on login"
    login_data = login_resp.json()
    assert "ok" in login_data and login_data["ok"] is True, "Login response does not indicate success"

    # Authenticated GET - should return 200 and settings object
    response_auth = session.get(settings_url, timeout=TIMEOUT)
    assert response_auth.status_code == 200, f"Expected 200 for authenticated request, got {response_auth.status_code}"

    json_data = response_auth.json()
    assert "settings" in json_data, "Settings object missing in response"

    settings = json_data["settings"]
    required_fields = ["shippingMode", "shippingFee", "currency", "storeEmail"]
    for field in required_fields:
        assert field in settings, f"Field '{field}' missing in settings"
    # Additional type asserts could be done
    assert isinstance(settings["shippingMode"], str), "shippingMode should be string"
    assert isinstance(settings["shippingFee"], (int, float)), "shippingFee should be a number"
    assert isinstance(settings["currency"], str) and len(settings["currency"]) == 3, "currency should be 3-letter string"
    assert isinstance(settings["storeEmail"], str), "storeEmail should be string"


test_get_api_admin_settings_reads_store_settings()