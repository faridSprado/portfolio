import asyncio
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
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> Navigate to http://localhost:5173
        await page.goto("http://localhost:5173")
        
        # -> Type 'What projects are highlighted?' into the chat input (textarea index 5) and send it by pressing Enter.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/div[3]/form/textarea').nth(0)
        await asyncio.sleep(3); await elem.fill('What projects are highlighted?')
        
        # -> Wait for the assistant streaming reply to finish (detect 'Escribiendo...' disappears). After it settles, verify the assistant reply is visible and then send the follow-up message 'Pick one and list the tech stack.' by typing it into textarea index 222 and pressing Enter.
        frame = context.pages[-1]
        # Input text
        elem = frame.locator('xpath=/html/body/div/div/div/div[3]/form/textarea').nth(0)
        await asyncio.sleep(3); await elem.fill('Pick one and list the tech stack.')
        
        # --> Assertions to verify final state
        frame = context.pages[-1]
        assert await frame.locator("xpath=//*[contains(., 'assistant reply')]").nth(0).is_visible(), "Expected 'assistant reply' to be visible"
        assert await frame.locator("xpath=//*[contains(., 'Pick one and list the tech stack.')]").nth(0).is_visible(), "Expected 'Pick one and list the tech stack.' to be visible"
        assert await frame.locator("xpath=//*[contains(., 'assistant reply')]").nth(0).is_visible(), "Expected 'assistant reply' to be visible"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    