from playwright.sync_api import sync_playwright

def run(playwright):
    print("Launching browser...")
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    print("Navigating to dashboard...")
    page.goto("http://localhost:5173/")

    # Wait for the Veritas Control Center
    print("Waiting for Veritas Control Center...")
    page.get_by_text("VERITAS COGNITIVE QA v1.0").wait_for(timeout=10000)

    # Click the trigger button
    print("Clicking TRIGGER NEURAL LOCATOR...")
    trigger_btn = page.get_by_text("TRIGGER NEURAL LOCATOR")
    trigger_btn.wait_for()
    trigger_btn.click()

    # Wait for results to appear
    print("Waiting for results...")
    page.get_by_text("CANDIDATES").wait_for(timeout=10000)
    page.get_by_text("LATENCY").wait_for(timeout=10000)

    # Take screenshot of the card specifically if possible, or full page
    print("Taking screenshot...")
    page.screenshot(path="verification_control_center.png")

    print("Closing browser...")
    browser.close()

with sync_playwright() as p:
    run(p)
