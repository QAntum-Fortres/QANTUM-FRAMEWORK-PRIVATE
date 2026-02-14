from playwright.sync_api import sync_playwright, expect

def test_execute_loading():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # 1. Navigate to the app
        print("Navigating to app...")
        page.goto("http://localhost:5173/")

        # 2. Switch to VORTEX UI
        print("Switching to Vortex UI...")
        page.get_by_role("button", name="VORTEX UI").click()

        # 3. Wait for Veritas Control Center to appear
        print("Waiting for Control Center...")
        # The execute button is inside the control center
        execute_btn = page.get_by_role("button", name="EXECUTE")
        expect(execute_btn).to_be_visible()

        # 4. Click EXECUTE
        print("Clicking Execute...")
        execute_btn.click()

        # 5. Verify loading state
        # The button text should change to "EXECUTING..."
        # And it should be disabled
        print("Verifying loading state...")
        # Note: Depending on how fast the mock response is (2000ms), we have time to catch it.
        # We look for the button with text "EXECUTING..."
        loading_btn = page.get_by_role("button", name="EXECUTING...")
        expect(loading_btn).to_be_visible()
        expect(loading_btn).to_be_disabled()

        # 6. Check for aria-busy
        print("Checking aria-busy...")
        is_busy = loading_btn.get_attribute("aria-busy")
        assert is_busy == "true", f"Expected aria-busy='true', got '{is_busy}'"

        # 7. Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification/execute_loading.png")

        # 8. Wait for completion (optional, just to be clean)
        print("Waiting for completion...")
        expect(page.get_by_role("button", name="EXECUTE")).to_be_visible(timeout=5000)

        browser.close()
        print("Verification complete!")

if __name__ == "__main__":
    test_execute_loading()
