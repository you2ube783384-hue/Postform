import requests

BASE_URL = "http://localhost:3000"
ADMIN_PASSWORD = "postform-admin-2026"
LOGIN_URL = f"{BASE_URL}/api/admin/login"
SETTINGS_URL = f"{BASE_URL}/api/admin/settings"
TIMEOUT = 30

def put_api_admin_settings_updates_store_settings_with_validation():
    session = requests.Session()

    # 1. Authenticate admin and get session cookie
    login_resp = session.post(LOGIN_URL, json={"password": ADMIN_PASSWORD}, timeout=TIMEOUT)
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    assert 'pf_admin' in login_resp.cookies or any('pf_admin' in c for c in session.cookies), "pf_admin cookie missing"

    # Helper to PUT settings and verify response
    def put_settings(payload, expected_status, expected_error=None):
        resp = session.put(SETTINGS_URL, json=payload, timeout=TIMEOUT)
        assert resp.status_code == expected_status, f"Expected status {expected_status} but got {resp.status_code} for payload {payload}, response: {resp.text}"
        if expected_status == 400:
            j = resp.json()
            assert "error" in j, f"Expected error field in response for payload {payload}"
            if expected_error:
                assert j["error"] == expected_error, f"Expected error '{expected_error}' but got '{j['error']}' for payload {payload}"
        if expected_status == 200:
            j = resp.json()
            # Validate keys exist and values updated if payload keys present
            assert "settings" in j, "Missing 'settings' in response JSON"
            for k, v in payload.items():
                assert k in j["settings"], f"Missing '{k}' key in settings response"
                if k == "currency" and isinstance(v, str):
                    # Accept case-insensitive match for currency code
                    assert j["settings"][k].upper() == v.upper(), f"Value mismatch for '{k}': expected {v} (case insensitive), got {j['settings'][k]}"
                else:
                    assert j["settings"][k] == v, f"Value mismatch for '{k}': expected {v}, got {j['settings'][k]}"
        return resp

    # Valid update to have baseline
    valid_payload = {
        "shippingMode": "free",
        "shippingFee": 0,
        "currency": "USD",
        "storeEmail": "store@example.com"
    }
    put_settings(valid_payload, 200)

    # Invalid shippingMode (not 'free' or 'flat')
    put_settings({"shippingMode": "express"}, 400, "INVALID_SHIPPING_MODE")

    # Negative shippingFee
    put_settings({"shippingFee": -5}, 400, "INVALID_SHIPPING_FEE")

    # Non-numeric shippingFee (should be rejected as invalid type, expect 400 INVALID_SHIPPING_FEE)
    put_settings({"shippingFee": "ten"}, 400, "INVALID_SHIPPING_FEE")

    # Invalid currency - too short
    put_settings({"currency": "US"}, 400, "INVALID_CURRENCY")

    # Invalid currency - too long
    put_settings({"currency": "USDA"}, 400, "INVALID_CURRENCY")

    # Invalid currency - empty string
    put_settings({"currency": ""}, 400, "INVALID_CURRENCY")

    # Valid currency but lowercase (should accept exact 3 letters case-insensitive)
    put_settings({"currency": "usd"}, 200)

    # Validate storeEmail format is not explicitly validated by API in PRD; Try invalid email string to confirm API allows any string (No error expected)
    put_settings({"storeEmail": "invalid-email-format"}, 200)

    # Clean-up: restore with valid values
    put_settings(valid_payload, 200)

put_api_admin_settings_updates_store_settings_with_validation()
