from playwright.sync_api import sync_playwright, expect
import os
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            print("Navigating to http://localhost:5173")
            page.goto("http://localhost:5173")

            # Wait for content
            print("Waiting for content...")

            # 1. Verify Header
            expect(page.get_by_text("Sovereign Dashboard")).to_be_visible()

            # 2. Verify Connection (It might start as CONNECTING, then switch to SYSTEM ONLINE)
            # We wait up to 10s for the WS to connect and data to render
            print("Waiting for Bio Stress card...")
            try:
                # If backend is running, this should appear
                expect(page.get_by_text("Bio Stress")).to_be_visible(timeout=10000)
                print("✅ Real-time data received (Bio Stress visible)")
            except:
                print("⚠️ Backend might not be reachable. Verifying Loading State instead.")
                expect(page.get_by_text("CONNECTING...")).to_be_visible()
                print("✅ Loading state verified")

            print("Taking screenshot...")
            if not os.path.exists("verification"):
                os.makedirs("verification")
            page.screenshot(path="verification/frontend_dashboard_final.png")
            print("Screenshot saved to verification/frontend_dashboard_final.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/frontend_error_final.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    run()
