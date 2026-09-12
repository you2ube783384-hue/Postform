import requests
import uuid

BASE_URL = "http://localhost:3000"
ADMIN_LOGIN_ENDPOINT = "/api/admin/login"
ADMIN_PRODUCTS_ENDPOINT = "/api/admin/products"

ADMIN_PASSWORD = "postform-admin-2026"
TIMEOUT = 30


def test_put_api_admin_products_id_updates_product_fully():
    session = requests.Session()

    # Admin login to get pf_admin cookie
    login_resp = session.post(
        f"{BASE_URL}{ADMIN_LOGIN_ENDPOINT}",
        json={"password": ADMIN_PASSWORD},
        timeout=TIMEOUT,
    )
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    assert "pf_admin" in login_resp.cookies.get_dict(), "pf_admin session cookie missing"

    created_product_id = None
    created_product_slug = None

    try:
        # Create a new product first to update it later
        unique_suffix = str(uuid.uuid4())[:8]
        original_slug = f"test-product-{unique_suffix}"
        product_payload = {
            "name": "Test Product Full Update",
            "category": "test-category",
            "price": 100.0,
            "slug": original_slug,
            "brand": "TestBrand",
            "originalPrice": 120.0,
            "condition": "NEW",
            "description": "Initial description",
            "material": "Cotton",
            "sizeChart": "Standard",
            "tags": ["tag1", "tag2"],
            "featured": False,
            "active": True,
            "images": [
                {"url": "http://example.com/image1.jpg", "alt": "image1"},
                {"url": "http://example.com/image2.jpg", "alt": "image2"},
            ],
            "variants": [
                {"size": "M", "color": "Red", "stock": 10},
                {"size": "L", "color": "Blue", "stock": 5},
            ],
        }
        post_resp = session.post(
            f"{BASE_URL}{ADMIN_PRODUCTS_ENDPOINT}",
            json=product_payload,
            timeout=TIMEOUT,
        )
        assert post_resp.status_code == 201, f"Product creation failed: {post_resp.text}"
        created_product = post_resp.json().get("product")
        assert created_product is not None, "No product returned on creation"
        created_product_id = created_product.get("id")
        created_product_slug = created_product.get("slug")
        assert created_product_id is not None, "Created product has no id"
        assert created_product_slug is not None, "Created product has no slug"

        # Prepare full update data replacing images and variants
        updated_slug = f"updated-product-{unique_suffix}"
        update_payload = {
            "id": created_product_id,
            "name": "Test Product Fully Updated",
            "category": "updated-category",
            "price": 150.0,
            "slug": updated_slug,
            "brand": "UpdatedBrand",
            "originalPrice": 170.0,
            "condition": "USED",
            "description": "Fully updated description",
            "material": "Wool",
            "sizeChart": "Updated Chart",
            "tags": ["updatedTag1", "updatedTag2"],
            "featured": True,
            "active": False,
            "images": [  # replacing images
                {"url": "http://example.com/updated_image1.jpg", "alt": "updated image1"},
                {"url": "http://example.com/updated_image2.jpg"},
            ],
            "variants": [  # replacing variants
                {"size": "S", "color": "Green", "stock": 8},
                {"size": "XL", "color": "Black", "stock": 3},
            ],
        }

        # Perform PUT request to update product fully
        put_resp = session.put(
            f"{BASE_URL}{ADMIN_PRODUCTS_ENDPOINT}/{created_product_id}",
            json=update_payload,
            timeout=TIMEOUT,
        )
        assert put_resp.status_code == 200, f"PUT update failed: {put_resp.text}"
        updated_product = put_resp.json().get("product")
        assert updated_product is not None, "No product returned after update"

        # Validate updated fields
        assert updated_product.get("id") == created_product_id
        assert updated_product.get("name") == update_payload["name"]
        assert updated_product.get("category") == update_payload["category"]
        assert float(updated_product.get("price")) == update_payload["price"]
        assert updated_product.get("slug") == update_payload["slug"]
        assert updated_product.get("brand") == update_payload["brand"]
        assert float(updated_product.get("originalPrice")) == update_payload["originalPrice"]
        assert updated_product.get("condition") == update_payload["condition"]
        assert updated_product.get("description") == update_payload["description"]
        assert updated_product.get("material") == update_payload["material"]
        assert updated_product.get("sizeChart") == update_payload["sizeChart"]
        assert isinstance(updated_product.get("tags"), list)
        assert set(updated_product.get("tags")) == set(update_payload["tags"])
        assert updated_product.get("featured") is True
        assert updated_product.get("active") is False

        # Validate images replaced
        updated_images = updated_product.get("images")
        assert isinstance(updated_images, list)
        assert len(updated_images) == len(update_payload["images"])
        urls = [img.get("url") for img in updated_images]
        for img_payload in update_payload["images"]:
            assert img_payload["url"] in urls

        # Validate variants replaced
        updated_variants = updated_product.get("variants")
        assert isinstance(updated_variants, list)
        assert len(updated_variants) == len(update_payload["variants"])
        for v in update_payload["variants"]:
            match = next(
                (
                    uv
                    for uv in updated_variants
                    if (uv.get("size") == v.get("size"))
                    and (uv.get("color") == v.get("color"))
                    and (int(uv.get("stock", -1)) == v.get("stock"))
                ),
                None,
            )
            assert match is not None, f"Variant {v} missing after update"

        # Test 400 VALIDATION on duplicate slug
        # Create another product to have a slug for duplication
        duplicate_slug = f"dup-slug-{unique_suffix}"
        another_product_payload = {
            "name": "Another Product",
            "category": "category",
            "price": 50,
            "slug": duplicate_slug,
            "images": [],
            "variants": [],
        }
        another_resp = session.post(
            f"{BASE_URL}{ADMIN_PRODUCTS_ENDPOINT}",
            json=another_product_payload,
            timeout=TIMEOUT,
        )
        assert another_resp.status_code == 201, f"Another product creation failed: {another_resp.text}"
        another_product = another_resp.json().get("product")
        assert another_product is not None
        another_product_id = another_product.get("id")

        # Attempt to update first product with duplicate slug
        duplicate_slug_update_payload = update_payload.copy()
        duplicate_slug_update_payload["slug"] = duplicate_slug
        dup_slug_resp = session.put(
            f"{BASE_URL}{ADMIN_PRODUCTS_ENDPOINT}/{created_product_id}",
            json=duplicate_slug_update_payload,
            timeout=TIMEOUT,
        )
        assert dup_slug_resp.status_code == 400, f"Expected 400 for duplicate slug but got: {dup_slug_resp.status_code}"
        error_json = dup_slug_resp.json()
        assert error_json.get("error") == "VALIDATION"
        details = error_json.get("details", {})
        slug_errors = details.get("slug") if isinstance(details, dict) else None
        if slug_errors:
            if isinstance(slug_errors, str):
                assert "DUPLICATE" in slug_errors.upper()
            elif isinstance(slug_errors, list):
                found_duplicate = any("DUPLICATE" in e.upper() for e in slug_errors if isinstance(e, str))
                assert found_duplicate

        # Test 404 NOT_FOUND for missing product id on PUT
        missing_id = "00000000-0000-0000-0000-000000000000"
        missing_resp = session.put(
            f"{BASE_URL}{ADMIN_PRODUCTS_ENDPOINT}/{missing_id}",
            json=update_payload,
            timeout=TIMEOUT,
        )
        assert missing_resp.status_code == 404, f"Expected 404 for missing product but got {missing_resp.status_code}"
        missing_err = missing_resp.json()
        assert missing_err.get("error") == "NOT_FOUND"

    finally:
        # Clean up created products
        if created_product_id:
            session.delete(f"{BASE_URL}{ADMIN_PRODUCTS_ENDPOINT}/{created_product_id}", timeout=TIMEOUT)
        # Clean another product if created
        if 'another_product_id' in locals() and another_product_id:
            session.delete(f"{BASE_URL}{ADMIN_PRODUCTS_ENDPOINT}/{another_product_id}", timeout=TIMEOUT)


test_put_api_admin_products_id_updates_product_fully()