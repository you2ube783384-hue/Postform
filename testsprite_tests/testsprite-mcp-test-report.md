# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** my-project (POSTFORM — Curated Streetwear Resale)
- **Date:** 2026-09-11
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

### Requirement: Guest Checkout & Order Confirmation
- **Description:** Guest customers complete checkout: customer info, international address, payment method selection, order email handoff with POSTFORM-#### confirmation.

#### Test TC001 Complete guest checkout from cart to email handoff
- **Test Code:** [TC001_Complete_guest_checkout_from_cart_to_email_handoff.py](./TC001_Complete_guest_checkout_from_cart_to_email_handoff.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/933b95e4-32e5-4493-8e12-b9441b1d5d33
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** End-to-end path from cart through checkout form to the email handoff confirmation verified.
---

#### Test TC002 Guest checkout collects address and opens order email
- **Test Code:** [TC002_Guest_checkout_collects_address_and_opens_order_email.py](./TC002_Guest_checkout_collects_address_and_opens_order_email.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/6ca10fea-1b75-4d51-9a2d-117b39e6647e
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Address form collects international delivery fields and the order email is prepared for the store recipient.
---

#### Test TC004 Add a product to the cart and start checkout
- **Test Code:** [TC004_Add_a_product_to_the_cart_and_start_checkout.py](./TC004_Add_a_product_to_the_cart_and_start_checkout.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/b9fa85d9-817b-44c0-9e92-4ddcca0630f0
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Cart-to-checkout transition works and the order summary is carried into the checkout flow.
---

#### Test TC006 Guest browses from homepage into a product and begins checkout
- **Test Code:** [TC006_Guest_browses_from_homepage_into_a_product_and_begins_checkout.py](./TC006_Guest_browses_from_homepage_into_a_product_and_begins_checkout.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/6a33788e-d6d1-44fe-9e54-15cb621bf519
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Homepage-to-product-to-checkout journey works without dead ends for a first-time visitor.
---

#### Test TC008 Proceed from cart to checkout
- **Test Code:** [TC008_Proceed_from_cart_to_checkout.py](./TC008_Proceed_from_cart_to_checkout.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/fe6e96ff-95d2-4581-8255-42d0cd989901
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Proceed-to-checkout action from the cart page reaches the checkout form reliably.
---

#### Test TC009 Complete guest checkout and receive order confirmation
- **Test Code:** [TC009_Complete_guest_checkout_and_receive_order_confirmation.py](./TC009_Complete_guest_checkout_and_receive_order_confirmation.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/4150769e-a673-4106-8e57-4eec01cd7897
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Order confirmation screen renders with a generated POSTFORM order number after submission.
---

#### Test TC016 Guest completes checkout from search results
- **Test Code:** [TC016_Guest_completes_checkout_from_search_results.py](./TC016_Guest_completes_checkout_from_search_results.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/42e74a9f-5a11-46ac-8c7f-97615b8a1734
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Search-driven purchase path (search, open product, checkout) works for goal-directed shoppers.
---

### Requirement: Cart Management
- **Description:** Add products with variant selection, review totals, and adjust quantities before checkout.

#### Test TC003 Select variants and add a product to cart
- **Test Code:** [TC003_Select_variants_and_add_a_product_to_cart.py](./TC003_Select_variants_and_add_a_product_to_cart.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/436b84fd-ceb3-4626-855c-96ca1854f8b0
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Size/colour variant selection feeds correctly into the add-to-cart action.
---

#### Test TC010 Review cart totals before checkout
- **Test Code:** [TC010_Review_cart_totals_before_checkout.py](./TC010_Review_cart_totals_before_checkout.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/9d7ccadb-5efd-4068-88a7-d3e2a57319b4
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Cart summary shows item lines, shipping and total consistent with store settings.
---

#### Test TC024 Update cart quantities and totals
- **Test Code:** [TC024_Update_cart_quantities_and_totals.py](./TC024_Update_cart_quantities_and_totals.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/f46d9fcb-ce48-4f6c-a42a-b50637714c57
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Quantity updates recalculate line totals and order summary without errors.
---

### Requirement: Product Catalogue & Discovery
- **Description:** Browse homepage and shop, search by keyword, apply filters and sorting, and paginate results.

#### Test TC012 Browse the shop catalogue and open a product
- **Test Code:** [TC012_Browse_the_shop_catalogue_and_open_a_product.py](./TC012_Browse_the_shop_catalogue_and_open_a_product.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/de8194f7-e508-4844-997e-b9cd997102e5
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Shop catalogue grid renders products and product cards link to detail pages.
---

#### Test TC015 Browse featured products from the homepage
- **Test Code:** [TC015_Browse_featured_products_from_the_homepage.py](./TC015_Browse_featured_products_from_the_homepage.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/885474a0-e3ff-4902-b02a-e0f774c69f27
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Featured/curated products surfaced on the homepage are reachable and browsable.
---

#### Test TC020 Search the shop for a specific item
- **Test Code:** [TC020_Search_the_shop_for_a_specific_item.py](./TC020_Search_the_shop_for_a_specific_item.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/914766f4-eda1-4b41-adcc-7996bdb2fff9
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Keyword search returns matching products from the catalogue.
---

#### Test TC022 Guest finds an item with search, filters, sort, and pagination
- **Test Code:** [TC022_Guest_finds_an_item_with_search_filters_sort_and_pagination.py](./TC022_Guest_finds_an_item_with_search_filters_sort_and_pagination.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/a6cc00a5-5a4a-4406-bb70-30ba5920b5ab
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Combined search + filters + sort + pagination journey narrows results correctly.
---

#### Test TC027 Filter the shop to narrow results
- **Test Code:** [TC027_Filter_the_shop_to_narrow_results.py](./TC027_Filter_the_shop_to_narrow_results.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/10fb053a-097c-4357-9399-19d1e1f7d4c4
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Individual filter application (brand/size/colour/condition/price) narrows the listing as expected.
---

### Requirement: Admin Authentication & Access Control
- **Description:** Admin login with the shared password, protected route access, and dashboard reachability.

#### Test TC005 Sign in to the admin dashboard
- **Test Code:** [TC005_Sign_in_to_the_admin_dashboard.py](./TC005_Sign_in_to_the_admin_dashboard.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/10c28dac-ac17-4ab7-8154-a2b0e4d3ee1c
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Admin sign-in with the correct password reaches the authenticated dashboard.
---

#### Test TC007 Admin signs in and reaches the dashboard
- **Test Code:** [TC007_Admin_signs_in_and_reaches_the_dashboard.py](./TC007_Admin_signs_in_and_reaches_the_dashboard.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/56c3d588-41f8-4628-8752-8ea2403ad305
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Authenticated admin session loads the dashboard with stats and stock information.
---

#### Test TC011 Open admin login and reach the dashboard
- **Test Code:** [TC011_Open_admin_login_and_reach_the_dashboard.py](./TC011_Open_admin_login_and_reach_the_dashboard.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/60d855f8-3738-4b89-a305-0d0db6b82eb7
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Admin login page is reachable from the storefront and login flow completes.
---

### Requirement: Admin Product Management
- **Description:** Create, edit, merchandise and manage products from the admin panel.

#### Test TC013 Create a new product in the admin panel
- **Test Code:** [TC013_Create_a_new_product_in_the_admin_panel.py](./TC013_Create_a_new_product_in_the_admin_panel.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/df122513-f164-4550-99d3-be1fda462ca9
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** New product creation form completes and the product is created.
---

#### Test TC014 Admin creates a new product
- **Test Code:** [TC014_Admin_creates_a_new_product.py](./TC014_Admin_creates_a_new_product.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/fbcd6f04-745e-4c57-b549-5f8d85b69d71
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Admin can create products with the full form (basics, pricing, variants, media).
---

#### Test TC017 Manage products from the admin product list
- **Test Code:** [TC017_Manage_products_from_the_admin_product_list.py](./TC017_Manage_products_from_the_admin_product_list.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/f43c1ba4-592a-49c5-adb3-6f9bbbab3976
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Products list/table loads and management actions are available.
---

#### Test TC028 Admin edits an existing product
- **Test Code:** [TC028_Admin_edits_an_existing_product.py](./TC028_Admin_edits_an_existing_product.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/75707e9a-a89c-448b-9473-8460b7e56cb1
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Editing an existing product saves changes correctly.
---

#### Test TC029 Edit product merchandising in the admin panel
- **Test Code:** [TC029_Edit_product_merchandising_in_the_admin_panel.py](./TC029_Edit_product_merchandising_in_the_admin_panel.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/c639fbd4-03eb-4699-a8c2-06767b7df106
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Merchandising edits (tags/featured/visibility) persist through the edit flow.
---

### Requirement: Admin Store Settings
- **Description:** Store-wide settings: shipping mode, currency and order email recipient.

#### Test TC019 Admin updates store settings
- **Test Code:** [TC019_Admin_updates_store_settings.py](./TC019_Admin_updates_store_settings.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/cd6b723e-43e2-484c-89bc-72f7a73fc6b3
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Settings form saves shipping, currency and order email changes successfully.
---

### Requirement: Customer Profile & Address Prefill
- **Description:** Local customer profile and saved addresses prefill the checkout form.

#### Test TC018 Prefill checkout from a saved customer profile
- **Test Code:** [TC018_Prefill_checkout_from_a_saved_customer_profile.py](./TC018_Prefill_checkout_from_a_saved_customer_profile.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/7ad32afe-57a8-4ee3-b4f6-d2f8b6b7a23f
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** A saved customer profile prefills checkout fields as designed.
---

#### Test TC021 Edit profile details and prefill checkout
- **Test Code:** [TC021_Edit_profile_details_and_prefill_checkout.py](./TC021_Edit_profile_details_and_prefill_checkout.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/8a505a27-2a20-49ab-bec6-1c2c8df50ce5
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Editing profile details is reflected when checkout is opened.
---

#### Test TC023 Update a saved local profile and see it used in checkout
- **Test Code:** [TC023_Update_a_saved_local_profile_and_see_it_used_in_checkout.py](./TC023_Update_a_saved_local_profile_and_see_it_used_in_checkout.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/4c0fa9b9-4ee5-4e18-91e0-4f91cc7075cb
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Profile updates propagate to the checkout prefill without stale data.
---

#### Test TC025 Returning customer profile pre-fills checkout details
- **Test Code:** [TC025_Returning_customer_profile_pre_fills_checkout_details.py](./TC025_Returning_customer_profile_pre_fills_checkout_details.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/5fd77b57-8030-41a4-87b3-35160c64fd94
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Returning-customer profile data is applied to checkout automatically.
---

#### Test TC026 Add a default address and prefill checkout
- **Test Code:** [TC026_Add_a_default_address_and_prefill_checkout.py](./TC026_Add_a_default_address_and_prefill_checkout.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/0f727f2b-3f57-4281-8a86-e977c11a3716
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Default address selection prefills the delivery address block.
---

### Requirement: Wishlist
- **Description:** Save products to the local wishlist from the storefront.

#### Test TC030 Save a product to the wishlist
- **Test Code:** [TC030_Save_a_product_to_the_wishlist.py](./TC030_Save_a_product_to_the_wishlist.py)
- **Test Error:** 
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/9928ef00-f6fc-55ac-820a-34f4c871b296/test/d878573c-67ad-4c30-857a-4efa584aa475
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Wishlist save action works from the product interface and persists locally.
---

## 3️⃣ Coverage & Matching Metrics

- 100% of tests passed (30/30) — production mode run, 30-test cap applied

| Requirement | Total Tests | ✅ Passed | ❌ Failed |
|-------------|-------------|-----------|------------|
| Guest Checkout & Order Confirmation | 7 | 7 | 0 |
| Cart Management | 3 | 3 | 0 |
| Product Catalogue & Discovery | 5 | 5 | 0 |
| Admin Authentication & Access Control | 3 | 3 | 0 |
| Admin Product Management | 5 | 5 | 0 |
| Admin Store Settings | 1 | 1 | 0 |
| Customer Profile & Address Prefill | 5 | 5 | 0 |
| Wishlist | 1 | 1 | 0 |

---

## 4️⃣ Key Gaps / Risks

### Covered and healthy
- All 30 executed tests passed: storefront browsing, search/filter/sort/pagination, variant-aware cart, guest checkout with order email handoff, local profile/address prefill, wishlist, admin authentication, product CRUD and store settings.
- The app ran in production mode (Next.js standalone build) throughout the run with no server errors or crashes under concurrent cloud test load.

### Not covered in this run
- 20 of the 50 planned tests were not executed due to the production-mode 30-test cap (TC031–TC050: wishlist-to-cart moves, category browsing, admin visibility/featured toggles, wrong-password rejection, cart-summary continuation, admin product deletion, settings save round-trip and related flows).
- No backend/API-only testing was performed (frontend scope). The admin REST API is exercised indirectly through the admin UI tests.
- Checkout email delivery is by design a customer-side mailto handoff; the run verified the confirmation screen and order ID, not real email transmission.
- LocalStorage-dependent flows (cart, wishlist, profile) were tested within single browser contexts; cross-device/cross-browser persistence is out of scope by design.

### Recommendations
- Re-run the remaining 20 test cases (TC031–TC050) in a follow-up run to complete the planned coverage.
- Consider a dedicated backend test run against the admin API endpoints for validation-depth coverage (auth, slug uniqueness, image URL validation).
- Add an explicit wrong-password admin login test to the next run (planned as TC037) — currently only the happy-path login is verified among executed tests.