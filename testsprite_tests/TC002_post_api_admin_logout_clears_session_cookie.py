import requests

BASE_URL = "http://localhost:3000"
ADMIN_LOGIN_PATH = "/api/admin/login"
ADMIN_LOGOUT_PATH = "/api/admin/logout"
ADMIN_PASSWORD = "postform-admin-2026"
TIMEOUT = 30


def test_post_api_admin_logout_clears_session_cookie():
    session = requests.Session()
    try:
        # 1. Admin login
        login_resp = session.post(
            f"{BASE_URL}{ADMIN_LOGIN_PATH}",
            json={"password": ADMIN_PASSWORD},
            timeout=TIMEOUT
        )
        assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
        assert login_resp.json().get("ok") is True, "Login response 'ok' is not True"
        # Check pf_admin cookie set and httpOnly flag presence in headers is not directly testable here,
        # but presence of 'pf_admin' cookie implies success
        cookies = session.cookies.get_dict()
        assert "pf_admin" in cookies, "pf_admin cookie not set after login"

        # 2. POST /api/admin/logout while authenticated
        logout_resp = session.post(
            f"{BASE_URL}{ADMIN_LOGOUT_PATH}",
            timeout=TIMEOUT
        )
        assert logout_resp.status_code == 200, f"Logout failed: {logout_resp.text}"
        logout_json = logout_resp.json()
        assert logout_json.get("ok") is True, "Logout response 'ok' is not True"

        # 3. Check that the pf_admin cookie is cleared by logout response
        # The Set-Cookie header should set pf_admin cookie with expires in past or empty value.
        set_cookie_headers = logout_resp.headers.get("Set-Cookie")
        assert set_cookie_headers is not None, "No Set-Cookie header on logout"
        # Check pf_admin cookie cleared indication in the headers
        # It typically clears cookie by setting it with 'pf_admin=; expires=Thu, 01 Jan 1970 00:00:00 GMT;'
        assert "pf_admin=" in set_cookie_headers and ("expires=Thu, 01 Jan 1970" in set_cookie_headers.lower() or "max-age=0" in set_cookie_headers.lower()), \
            "pf_admin cookie not cleared in Set-Cookie header"

        # 4. Confirm session no longer authenticated by accessing an authenticated endpoint and expect 401
        check_resp = session.get(f"{BASE_URL}/api/admin/settings", timeout=TIMEOUT)
        # According to instructions, unauthenticated /api/admin/* calls return 401.
        assert check_resp.status_code == 401, f"Session not cleared after logout; expected 401 got {check_resp.status_code}"

    finally:
        session.close()


test_post_api_admin_logout_clears_session_cookie()