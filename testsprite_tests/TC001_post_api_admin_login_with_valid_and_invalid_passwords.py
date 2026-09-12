import requests

BASE_URL = "http://localhost:3000"
LOGIN_PATH = "/api/admin/login"
ADMIN_PASSWORD = "postform-admin-2026"
TIMEOUT = 30


def test_post_api_admin_login_with_valid_and_invalid_passwords():
    session = requests.Session()

    # Test with correct password
    correct_payload = {"password": ADMIN_PASSWORD}
    try:
        response = session.post(f"{BASE_URL}{LOGIN_PATH}", json=correct_payload, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}"
        json_data = response.json()
        assert json_data.get("ok") is True, f"Expected 'ok': True, got {json_data}"
        # Check pf_admin session cookie is set and httpOnly
        pf_admin_cookie = None
        for cookie in session.cookies:
            if cookie.name == "pf_admin":
                pf_admin_cookie = cookie
                break
        assert pf_admin_cookie is not None, "pf_admin session cookie not set on successful login"
        # Cannot check HttpOnly from client, but the cookie must be set
    except Exception as e:
        raise AssertionError(f"Valid login test failed: {e}")

    # Test with incorrect password
    invalid_payload = {"password": "wrong-password-1234"}
    try:
        response = requests.post(f"{BASE_URL}{LOGIN_PATH}", json=invalid_payload, timeout=TIMEOUT)
        assert response.status_code == 401, f"Expected 401 INVALID_PASSWORD, got {response.status_code}"
        json_data = response.json()
        assert json_data.get("error") == "INVALID_PASSWORD", f"Expected error 'INVALID_PASSWORD', got {json_data}"
    except Exception as e:
        raise AssertionError(f"Invalid login test failed: {e}")

    # Test with malformed request body (missing password field)
    malformed_payload = {"pass": "nopassword"}
    try:
        response = requests.post(f"{BASE_URL}{LOGIN_PATH}", json=malformed_payload, timeout=TIMEOUT)
        assert response.status_code == 400, f"Expected 400 BAD_REQUEST, got {response.status_code}"
        json_data = response.json()
        assert json_data.get("error") == "BAD_REQUEST", f"Expected error 'BAD_REQUEST', got {json_data}"
    except Exception as e:
        raise AssertionError(f"Malformed login request test failed: {e}")


test_post_api_admin_login_with_valid_and_invalid_passwords()