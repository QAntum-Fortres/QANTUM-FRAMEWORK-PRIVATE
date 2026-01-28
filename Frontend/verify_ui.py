from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:5173")
            page.goto("http://localhost:5173")

            # Wait for content
            print("Waiting for content...")
            # We look for "Helios Dashboard (Ready)" which is in App.tsx
            locator = page.get_by_text("Helios Dashboard (Ready)")
            expect(locator).to_be_visible(timeout=10000)

            print("Taking screenshot...")
            if not os.path.exists("verification"):
                os.makedirs("verification")
            page.screenshot(path="verification/frontend_dashboard.png")
            print("Screenshot saved to verification/frontend_dashboard.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/frontend_error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
