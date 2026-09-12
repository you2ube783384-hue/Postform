# TestSprite AI Testing Report(MCP) — Frontend (Mobile App-Like UX Validation)

---

## 1️⃣ Document Metadata
- **Project Name:** POSTFORM (my-project)
- **Date:** 2026-09-12
- **Test Type:** Frontend E2E (production server, cloud browsers via tunnel)
- **Scope:** Priority batch of 12 tests validating the new app-like mobile experience plus the core commerce flow (checkout handoff, cart, wishlist, search/filters, categories, admin auth)
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

### Requirement: Guest Shopping Flow (search → product → cart → checkout → email handoff)
- **Description:** The complete one-thumb purchase journey on the app-like mobile UI, ending in the mailto order handoff.

#### Test TC001 Complete guest checkout with delivery details and order handoff
- **Test Code:** [TC001_Complete_guest_checkout_with_delivery_details_and_order_handoff.py](./TC001_Complete_guest_checkout_with_delivery_details_and_order_handoff.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/7cc0246b-b9a6-4984-a98f-7600ec8e8937
- **Status:** ✅ Passed
- **Severity:** HIGH
- **Analysis / Findings:** Guest fills contact details, international delivery address, payment choice, and note; order confirmation reached with the mailto handoff. No account creation forced — spec requirement confirmed.

#### Test TC004 Add a product to the cart from product detail
- **Test Code:** [TC004_Add_a_product_to_the_cart_from_product_detail.py](./TC004_Add_a_product_to_the_cart_from_product_detail.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/0a1ea7f3-1c27-44da-a2fb-dff7b5c37675
- **Status:** ✅ Passed
- **Severity:** HIGH
- **Analysis / Findings:** Product page add-to-cart works including the sticky mobile buy bar path; cart badge updates on the bottom navigation.

#### Test TC007 Update cart quantities and see totals recalculate
- **Test Code:** [TC007_Update_cart_quantities_and_see_totals_recalculate.py](./TC007_Update_cart_quantities_and_see_totals_recalculate.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/7b67c5ed-619b-4638-a15d-e585b843930d
- **Status:** ✅ Passed
- **Severity:** HIGH
- **Analysis / Findings:** Quantity steppers (44px touch targets) update line prices and the order summary totals live, bounded by stock.

#### Test TC011 Remove an item from the cart
- **Test Code:** [TC011_Remove_an_item_from_the_cart.py](./TC011_Remove_an_item_from_the_cart.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/2184c7bc-2cda-4fd6-a603-3f0268ce423c
- **Status:** ✅ Passed
- **Severity:** MEDIUM
- **Analysis / Findings:** Remove button deletes the line item; empty-cart state appears when the last item is removed.

---

### Requirement: Product Discovery (search, categories, filters)
- **Description:** The mobile discovery surfaces — persistent header search, horizontal category strip, bottom-sheet filters.

#### Test TC014 Browse featured products and open a product detail page
- **Test Code:** [TC014_Browse_featured_products_and_open_a_product_detail_page.py](./TC014_Browse_featured_products_and_open_a_product_detail_page.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/6774619e-3df8-4e84-9137-d4cce32d2334
- **Status:** ✅ Passed
- **Severity:** HIGH
- **Analysis / Findings:** Featured products render on the home grid; tapping a card opens the product detail with the swipeable gallery.

#### Test TC015 Search and filter products in the shop
- **Test Code:** [TC015_Search_and_filter_products_in_the_shop.py](./TC015_Search_and_filter_products_in_the_shop.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/23804832-c27d-4a23-9635-49f5a8f10045
- **Status:** ✅ Passed
- **Severity:** HIGH
- **Analysis / Findings:** The persistent mobile search bar narrows results; the FILTER bottom sheet applies filters with the Show results action; clear-all restores the catalogue.

#### Test TC017 Browse a category listing and open a product
- **Test Code:** [TC017_Browse_a_category_listing_and_open_a_product.py](./TC017_Browse_a_category_listing_and_open_a_product.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/b2f18ff8-c621-4a27-93d9-ebd0cab08d65
- **Status:** ✅ Passed
- **Severity:** HIGH
- **Analysis / Findings:** The horizontally scrolling category strip (active pill state) navigates to a filtered listing; product pages open correctly from the grid.

#### Test TC021 Search the shop for matching products
- **Test Code:** [TC021_Search_the_shop_for_matching_products.py](./TC021_Search_the_shop_for_matching_products.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/b03fe1f0-c318-4226-8a9d-bb641120fa45
- **Status:** ✅ Passed
- **Severity:** MEDIUM
- **Analysis / Findings:** Search matches product names and categories with a clear no-results state ("Nothing matched").

---

### Requirement: Wishlist
- **Description:** Save/unsave products and move saved items to the cart.

#### Test TC018 Save a product to the wishlist from product detail
- **Test Code:** [TC018_Save_a_product_to_the_wishlist_from_product_detail.py](./TC018_Save_a_product_to_the_wishlist_from_product_detail.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/1c415568-a2c0-4c4e-a3e2-e92e3e390f5c
- **Status:** ✅ Passed
- **Severity:** MEDIUM
- **Analysis / Findings:** Wishlist heart toggles with clear saved state; the SAVED tab badge in the bottom navigation reflects the count.

#### Test TC022 Move a wishlist item to the cart
- **Test Code:** [TC022_Move_a_wishlist_item_to_the_cart.py](./TC022_Move_a_wishlist_item_to_the_cart.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/872e798b-2ef9-4e34-8885-6ae991780a77
- **Status:** ✅ Passed
- **Severity:** MEDIUM
- **Analysis / Findings:** Wishlist-to-cart transfer works; the cart badge on the bottom navigation updates immediately.

---

### Requirement: Admin Access
- **Description:** Password-gated admin panel reachable through the browser.

#### Test TC002 Sign in to admin and reach the protected panel
- **Test Code:** [TC002_Sign_in_to_admin_and_reach_the_protected_panel.py](./TC002_Sign_in_to_admin_and_reach_the_protected_panel.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/2921a9b5-9b78-473d-b703-0d29008ac6fa
- **Status:** ✅ Passed
- **Severity:** HIGH
- **Analysis / Findings:** Admin login accepts the password and reaches the protected dashboard; the protocol-aware session cookie works in the browser.

---

### Requirement: Variant Selection
- **Description:** Size/colour selection with stock-aware availability.

#### Test TC006 Choose variants and add a product to the cart
- **Test Code:** [TC006_Choose_variants_and_add_a_product_to_the_cart.py](./TC006_Choose_variants_and_add_a_product_to_the_cart.py)
- **Test Error:** TEST BLOCKED — the product page does not provide a colour selection control required by the test steps (only size and quantity controls are visible on the tested product).
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/14f87578-025a-5cc6-a0dc-99b8ebd87dad/test/708ed087-44f4-4d68-8d64-07b168333958
- **Status:** ⚠️ Blocked (test-data limitation, not an application defect)
- **Severity:** LOW
- **Analysis / Findings:** The tested product (Defaced Backprint Tee) has a single colour, and the app intentionally renders the colour picker only for multi-colour products (spec §14: "Only display/select variants that are actually available"). No product in the current 14-item catalogue has multiple colours, so the colour-picker path could not be exercised by this test batch. Size selection, quantity stepper, and add-to-cart on the same page were observed working. Manual verification of the multi-colour path is recommended after adding a multi-colour product to the catalogue.

---

## 3️⃣ Coverage & Matching Metrics

- **91.67** of tests passed (11 ✅ Passed, 1 ⚠️ Blocked, 0 ❌ Failed)

| Requirement | Total Tests | ✅ Passed | ⚠️ Blocked | ❌ Failed |
|---|---|---|---|---|
| Guest Shopping Flow | 4 | 4 | 0 | 0 |
| Product Discovery | 4 | 4 | 0 | 0 |
| Wishlist | 2 | 2 | 0 | 0 |
| Admin Access | 1 | 1 | 0 | 0 |
| Variant Selection | 1 | 0 | 1 | 0 |
| **Total** | **12** | **11** | **1** | **0** |

**Mobile UX features exercised:** persistent search bar, horizontal category strip with active pill, fixed 5-tab bottom navigation with live cart/wishlist badges, sticky mobile buy bar, bottom-sheet filters, skeleton/empty states. Desktop navigation (≥1024px) was validated in the prior 30-test run (30/30 passed) and remains structurally unchanged.

---

## 4️⃣ Key Gaps / Risks

1. **Colour-variant path untested by automation** — no catalogue product has multiple colours, so the colour picker never renders. Add at least one multi-colour product to the catalogue and re-run the variant test (or verify manually).
2. **Full 50-test plan not exhausted** — 38 remaining tests (profile prefill, admin CRUD depth, settings, pagination, dashboard metrics, order-email recipient) were not executed in this batch due to the 10-minute execution window and credit budget (74.5 credits remaining). They can be run in follow-up batches via `testIds`.
3. **No checkout payment integration** — payment selection is captured but processing happens over email; online payment remains a roadmap item.
4. **Admin login has no rate limiting** — repeated failures are not throttled (same finding as the backend report).

**Application fixes validated by this run:** all changes from the backend hardening cycle (protocol-aware session cookies, validation responses) work end-to-end in the browser; the new mobile navigation model does not break any core commerce flow.

---
