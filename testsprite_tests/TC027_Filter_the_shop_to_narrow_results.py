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
        
        # -> Click the 'Shop the catalogue' link to open the shop/catalog page.
        # Shop the catalogue link
        elem = page.get_by_role("link", name="Shop the catalogue")
        await elem.click(timeout=10000)
        
        # -> Click the 'Nike' checkbox in the Brand filter list in the left Filters panel.
        # checkbox
        elem = page.get_by_role("checkbox", name="Nike")
        await elem.click(timeout=10000)
        
        # -> Click the 'NEW' checkbox in the Condition filter to further narrow results.
        # checkbox
        elem = page.get_by_role("checkbox", name="NEW 7")
        await elem.click(timeout=10000)
        
        # -> Click the 'Nike Essential Jogger Sweatpant' product link to open the product page and confirm the product title and price are displayed.
        # Nike Essential Jogger Sweatpant link
        elem = page.get_by_role("link", name="Nike Essential Jogger")
        await elem.click(timeout=10000)
        
        # -> Verify the product page shows 'Essential Jogger Sweatpant' and '$48', then go back to the Shop results and verify the '1 RESULT' count is visible.
        await page.go_back()
        
        # --> Assertions to verify final state
        
        # --> Applying the Brand (Nike) and Condition (NEW) filters shows a product card for the Nike Essential Jogger Sweatpant.
        # Assert-outcome: passed
        # Assert: The URL contains the brand and condition filter parameters.
        await expect(page).to_have_url(re.compile("brand=Nike\\&cond=NEW"), timeout=15000), "The URL contains the brand and condition filter parameters."
        await page.get_by_role("link", name="Essential Jogger Sweatpant", exact=True).nth(0).scroll_into_view_if_needed()
        # Assert-outcome: passed
        # Assert: A product card titled 'Essential Jogger Sweatpant' is visible on the results grid.
        await expect(page.get_by_role("link", name="Essential Jogger Sweatpant", exact=True).nth(0)).to_be_visible(timeout=15000), "A product card titled 'Essential Jogger Sweatpant' is visible on the results grid."
        
        # --> The results header indicates the result set was narrowed to a single item ('1 RESULT').
        # Assert-outcome: passed
        # Assert: Exactly one product card is shown in the filtered results.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/div[2]/div[1]/div[2]/article/div/a")).to_have_count(1, timeout=15000), "Exactly one product card is shown in the filtered results."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    