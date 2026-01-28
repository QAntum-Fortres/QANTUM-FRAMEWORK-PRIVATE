from playwright.sync_api import sync_playwright
import time
import os

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Absolute path to the file
        file_path = f"file://{os.getcwd()}/docs/vortex-dashboard.html"
        print(f"Opening: {file_path}")

        page.goto(file_path)

        # Wait for the "VERITAS COGNITIVE FRAMEWORK" section to be visible
        page.wait_for_selector("text=VERITAS COGNITIVE FRAMEWORK")

        # Wait for the canvas to be drawn (simulation)
        time.sleep(2)

        # Scroll to the new section
        element = page.locator("text=VERITAS COGNITIVE FRAMEWORK")
        element.scroll_into_view_if_needed()

        # Take screenshot
        screenshot_path = "verification/dashboard_veritas.png"
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_dashboard()
