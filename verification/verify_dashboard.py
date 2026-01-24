import os
from playwright.sync_api import sync_playwright

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get absolute path to the file
        cwd = os.getcwd()
        file_path = os.path.join(cwd, 'docs/vortex-dashboard.html')
        url = f'file://{file_path}'

        print(f"Navigating to: {url}")
        page.goto(url)

        # Wait for the dashboard to load (checking for a specific element)
        page.wait_for_selector('.dashboard')
        page.wait_for_selector('#neuralCanvas')

        # Take screenshot
        screenshot_path = os.path.join(cwd, 'verification/dashboard_screenshot.png')
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to: {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    verify_dashboard()
