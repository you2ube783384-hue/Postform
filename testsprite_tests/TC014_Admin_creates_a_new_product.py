import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the admin login page (Admin Login) at /admin/login.
        await page.goto("http://localhost:3000/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill 'postform-admin-2026' into the Admin password field and submit the form by pressing Enter to activate the 'ENTER ADMIN' button.
        # Admin password password field
        elem = page.get_by_role("textbox", name="Admin password")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("postform-admin-2026")
        
        # -> Click the 'Add product' button to open the New Product form.
        # Add product link
        elem = page.get_by_role("link", name="Add product", exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the 'NAME' field with a test product name and open the 'CATEGORY' dropdown so its options can render.
        # HEAVYWEIGHT BOXY TEE text field
        elem = page.get_by_role("textbox", name="NAME *")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Merch Test Tee")
        
        # -> Fill the 'NAME' field with a test product name and open the 'CATEGORY' dropdown so its options can render.
        # — SELECT — T-Shirts Oversized T-Shirts Shirts... dropdown
        elem = page.get_by_label("CATEGORY *— SELECT —T-")
        await elem.click(timeout=10000)
        
        # -> Select the 'T-Shirts' option in the CATEGORY dropdown.
        # — SELECT — T-Shirts Oversized T-Shirts Shirts... dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/div/div[2]/div/section/div[2]/div/label[2]/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Fill the DESCRIPTION field with a product description and the SIZE CHART field (visible as 'DESCRIPTION' and 'SIZE CHART — OPTIONAL') on the Add Product page.
        # Honest, specific, sells the piece… text area
        elem = page.get_by_role("textbox", name="DESCRIPTION")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("High-quality heavyweight cotton tee \u2014 classic fit, crafted from 100% cotton. Ideal for everyday wear; screen-print friendly. Merch sample for QA.")
        
        # -> Fill the DESCRIPTION field with a product description and the SIZE CHART field (visible as 'DESCRIPTION' and 'SIZE CHART — OPTIONAL') on the Add Product page.
        # SIZE — CHEST — LENGTH M — 50cm — 69cm text area
        elem = page.get_by_role("textbox", name="SIZE CHART — OPTIONAL")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("M \u2014 50cm \u2014 69cm")
        
        # -> Set the selling price to $45 and click the 'APPAREL S–XXL' quick-add button to create size variants.
        # 45 number field
        elem = page.get_by_role("spinbutton", name="SELLING PRICE ($) *")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("45")
        
        # -> Set the selling price to $45 and click the 'APPAREL S–XXL' quick-add button to create size variants.
        # APPAREL S–XXL button
        elem = page.get_by_role("button", name="APPAREL S–XXL")
        await elem.click(timeout=10000)
        
        # -> Fill '10' into each variant stock field for sizes S, M, L, XL, and XXL so variant stock rows are non-zero.
        # Variant 1 stock number field
        elem = page.get_by_role("spinbutton", name="Variant 1 stock")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("10")
        
        # -> Fill '10' into each variant stock field for sizes S, M, L, XL, and XXL so variant stock rows are non-zero.
        # Variant 2 stock number field
        elem = page.get_by_role("spinbutton", name="Variant 2 stock")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("10")
        
        # -> Fill '10' into each variant stock field for sizes S, M, L, XL, and XXL so variant stock rows are non-zero.
        # Variant 3 stock number field
        elem = page.get_by_role("spinbutton", name="Variant 3 stock")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("10")
        
        # -> Fill '10' into each variant stock field for sizes S, M, L, XL, and XXL so variant stock rows are non-zero.
        # Variant 4 stock number field
        elem = page.get_by_role("spinbutton", name="Variant 4 stock")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("10")
        
        # -> Fill '10' into each variant stock field for sizes S, M, L, XL, and XXL so variant stock rows are non-zero.
        # Variant 5 stock number field
        elem = page.get_by_role("spinbutton", name="Variant 5 stock")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("10")
        
        # -> Enter an image URL and alt text, click 'Add image', then click the 'PUBLISH PRODUCT' button to publish the new product.
        # New image URL url field
        elem = page.get_by_role("textbox", name="New image URL")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("https://via.placeholder.com/800")
        
        # -> Enter an image URL and alt text, click 'Add image', then click the 'PUBLISH PRODUCT' button to publish the new product.
        # New image alt text text field
        elem = page.get_by_role("textbox", name="New image alt text")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Merch Test Tee - front")
        
        # -> Enter an image URL and alt text, click 'Add image', then click the 'PUBLISH PRODUCT' button to publish the new product.
        # Add image button
        elem = page.get_by_role("button", name="Add image")
        await elem.click(timeout=10000)
        
        # -> Enter an image URL and alt text, click 'Add image', then click the 'PUBLISH PRODUCT' button to publish the new product.
        # PUBLISH PRODUCT button
        elem = page.get_by_role("button", name="PUBLISH PRODUCT")
        await elem.click(timeout=10000)
        
        # -> Verify the new product 'Merch Test Tee' appears in the products list by searching the page for 'Merch Test Tee' and then open its 'Edit' page.
        # Edit Merch Test Tee link
        elem = page.get_by_role("link", name="Edit Merch Test Tee")
        await elem.click(timeout=10000)
        
        # -> Click the 'PRODUCTS' link in the sidebar to open the products list and verify that 'Merch Test Tee' appears in the list.
        # PRODUCTS link
        elem = page.get_by_role("link", name="PRODUCTS")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> New product 'Merch Test Tee' appears in the admin Products list.
        # Assert-outcome: passed
        # Assert: The first product row contains the product name 'Merch Test Tee'.
        await expect(page.locator("tbody").nth(0)).to_contain_text("Merch Test Tee", timeout=15000), "The first product row contains the product name 'Merch Test Tee'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    