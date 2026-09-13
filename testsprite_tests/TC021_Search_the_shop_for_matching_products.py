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
        
        # -> Click the 'SHOP ALL' link in the header to open the shop/catalogue page.
        # ▚ SHOP ALL link
        elem = page.get_by_role("link", name="SHOP ALL", exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Open search' button (magnifying glass) in the header to reveal the search field.
        # Open search button
        elem = page.get_by_role("button", name="Open search")
        await elem.click(timeout=10000)
        
        # -> Type 'Tee' into the header search field (placeholder: SEARCH PRODUCTS…) and submit the search using the search button.
        # Search products search field
        elem = page.get_by_role("searchbox", name="Search products")
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Tee")
        
        # -> Type 'Tee' into the header search field (placeholder: SEARCH PRODUCTS…) and submit the search using the search button.
        # Submit search button
        elem = page.get_by_role("button", name="Submit search")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> The search query is reflected in the page URL as q=Tee.
        # Assert-outcome: passed
        # Assert: URL contains the search query parameter q=Tee.
        await expect(page).to_have_url(re.compile("q=Tee"), timeout=15000), "URL contains the search query parameter q=Tee."
        
        # --> Search results show product tiles matching the query, including QA Test Tee 2026 and Automated Test Tee.
        await page.get_by_text("QA Test Tee").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: Product 'QA Test Tee 2026' is visible in the search results.
        await expect(page.get_by_text("QA Test Tee").nth(0)).to_be_visible(timeout=15000), "Product 'QA Test Tee 2026' is visible in the search results."
        await page.get_by_text("Automated Test Tee").nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: Product 'Automated Test Tee' is visible in the search results.
        await expect(page.get_by_text("Automated Test Tee").nth(0)).to_be_visible(timeout=15000), "Product 'Automated Test Tee' is visible in the search results."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    