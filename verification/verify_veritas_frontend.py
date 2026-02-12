from playwright.sync_api import sync_playwright, expect
import time

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the dashboard
        print("Navigating to dashboard...")
        page.goto("http://localhost:5173/")

        # Wait for the page to load
        page.wait_for_load_state("networkidle")

        # Verify dashboard title
        expect(page.get_by_text("Sovereign Dashboard")).to_be_visible()

        # Verify the new component "Cognitive Layer" is visible
        print("Verifying Veritas Cognitive Layer...")
        # Since the component renders "Cognitive Layer", we check for that.
        # We also check for "Active Neural Map".
        expect(page.get_by_text("Cognitive Layer")).to_be_visible()
        expect(page.get_by_text("Active Neural Map")).to_be_visible()

        # Verify Agents are rendered (simulated in the component)
        time.sleep(4)

        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification/veritas_dashboard.png")

        browser.close()
        print("Verification complete.")

if __name__ == "__main__":
    verify_dashboard()
