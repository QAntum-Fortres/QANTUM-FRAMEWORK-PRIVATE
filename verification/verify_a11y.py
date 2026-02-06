from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:5173")
            page.goto("http://localhost:5173")

            # Wait for content to load
            # Better to wait for a specific element than sleep, but this is simple verification
            page.wait_for_selector("text=Sovereign Dashboard", timeout=10000)

            print("Verifying Header Notifications button...")
            # Using get_by_label to verify aria-label works
            notifications_btn = page.get_by_label("Notifications")
            expect(notifications_btn).to_be_visible()
            print("✅ Notifications button found via aria-label")

            print("Verifying Sidebar Collapse button...")
            # Initially sidebar is expanded, so label should be "Collapse sidebar"
            collapse_btn = page.get_by_label("Collapse sidebar")
            expect(collapse_btn).to_be_visible()
            print("✅ Collapse button found via aria-label")

            # Click it to toggle
            collapse_btn.click()
            # Wait for animation or state update
            time.sleep(0.5)

            # Now it should be "Expand sidebar"
            expand_btn = page.get_by_label("Expand sidebar")
            expect(expand_btn).to_be_visible()
            print("✅ Expand button found via aria-label (after toggle)")

            print("Taking screenshot...")
            page.screenshot(path="verification/verification.png")
            print("Screenshot saved.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
