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
        await page.goto("http://localhost:3000/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'SHOP ALL' link in the top navigation to open the catalogue page.
        # ▚ SHOP ALL link
        elem = page.get_by_role("link", name="SHOP ALL", exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Open search' button to reveal the shop search input.
        # Open search button
        elem = page.get_by_role("button", name="Open search")
        await elem.click(timeout=10000)
        
        # -> Enter 'TestBrand' into the header search input (label: SEARCH PRODUCTS…) and click the search button to run the search and update the product grid.
        # Search products search field
        elem = page.get_by_role("searchbox", name="Search products")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("TestBrand")
        
        # -> Enter 'TestBrand' into the header search input (label: SEARCH PRODUCTS…) and click the search button to run the search and update the product grid.
        # Submit search button
        elem = page.get_by_role("button", name="Submit search")
        await elem.click(timeout=10000)
        
        # -> Apply the 'TestBrand' brand filter by checking the 'TestBrand' checkbox in the Brand filter section.
        # checkbox
        elem = page.get_by_role("checkbox", name="TestBrand")
        await elem.click(timeout=10000)
        
        # -> Open the Sort dropdown labeled 'NEWEST' so the sort options (including 'PRICE: LOW — HIGH') become available.
        # NEWEST PRICE: LOW — HIGH PRICE: HIGH — LOW A — Z dropdown
        elem = page.get_by_label("Sort")
        await elem.click(timeout=10000)
        
        # -> Select the 'PRICE: LOW — HIGH' option from the Sort dropdown to change the product sort order.
        # NEWEST PRICE: LOW — HIGH PRICE: HIGH — LOW A — Z dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/div/div[3]/div/div/div[2]/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # -> Select the 'PRICE: LOW — HIGH' option in the Sort dropdown to ensure sorting is applied.
        # NEWEST PRICE: LOW — HIGH PRICE: HIGH — LOW A — Z dropdown
        elem = page.locator("xpath=/html/body/div[2]/main/div/div[3]/div/div/div[2]/select").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.select_option("")
        
        # --> Assertions to verify final state
        
        # --> Filtered product results are visible in the product grid (example product 'Test Product 20222b20' is shown).
        await page.get_by_role("link", name="TestBrand Test Product 20222b20").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: The first product card is visible in the results grid.
        await expect(page.get_by_role("link", name="TestBrand Test Product 20222b20").nth(0)).to_be_visible(timeout=15000), "The first product card is visible in the results grid."
        
        # --> Search term 'TestBrand', Brand filter, and price sort (low→high) are applied as reflected in the page URL.
        # Assert-outcome: passed
        # Assert: URL contains the applied search, brand, and sort parameters.
        await expect(page).to_have_url(re.compile("q=TestBrand\\&brand=TestBrand\\&sort=price\\-asc"), timeout=15000), "URL contains the applied search, brand, and sort parameters."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    