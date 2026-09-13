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
        
        # -> Click the "Shop the catalogue" link to open the full catalogue.
        # Shop the catalogue link
        elem = page.get_by_role("link", name="Shop the catalogue")
        await elem.click(timeout=10000)
        
        # -> Click the 'QA Test Tee 2026' product card to open its product detail page.
        # QA Test Tee 2026 link
        elem = page.get_by_text("QA Test Tee")
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Product detail page for 'QA Test Tee 2026' is displayed (navigated to the product URL).
        # Assert-outcome: passed
        # Assert: URL contains the product path /product/qa-test-tee-2026.
        await expect(page).to_have_url(re.compile("product/qa\\-test\\-tee\\-2026"), timeout=15000), "URL contains the product path /product/qa-test-tee-2026."
        
        # --> Product information is visible on the page (size option and Add to cart control are present).
        # Assert-outcome: passed
        # Assert: The size option 'S' is visible on the product page.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/div[1]/div[2]/div[2]/div[3]/div[2]/button[1]").nth(0)).to_have_text("S", timeout=15000), "The size option 'S' is visible on the product page."
        # Assert-outcome: passed
        # Assert: The 'Add to cart' button is present on the product page.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/div[1]/div[2]/div[2]/div[5]/div[1]/button[1]").nth(0)).to_have_text("Add to cart", timeout=15000), "The 'Add to cart' button is present on the product page."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    