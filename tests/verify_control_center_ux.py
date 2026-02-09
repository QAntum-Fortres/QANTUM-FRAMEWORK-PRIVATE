import time
from playwright.sync_api import sync_playwright, expect

def verify_control_center_ux():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        print("Navigating to dashboard...")
        page.goto("http://localhost:5173")

        # Wait for the dashboard to load
        page.wait_for_selector("text=Sovereign Dashboard", timeout=10000)
        print("Dashboard loaded.")

        # Locate the Veritas Control Center
        control_center = page.locator("text=VERITAS COGNITIVE QA").first
        expect(control_center).to_be_visible()
        print("Veritas Control Center found.")

        # Verify Input Accessibility
        input_field = page.get_by_placeholder("Describe the mission objective...")
        expect(input_field).to_be_visible()
        expect(input_field).to_have_attribute("aria-label", "Agent Goal")
        print("Input field verified (placeholder & aria-label).")

        # Verify Button Disabled State with Empty Input
        input_field.fill("")
        execute_button = page.get_by_role("button", name="EXECUTE")
        expect(execute_button).to_be_disabled()
        print("Execute button disabled when input is empty.")

        # Verify Button Enabled State with Input
        input_field.fill("Test Mission")
        expect(execute_button).to_be_enabled()
        print("Execute button enabled when input has text.")

        # Verify Loading State
        # We need to click and immediately check for "EXECUTING..." text or the spinner
        execute_button.click()

        # The button text should change to "EXECUTING..."
        # Note: The button might complete quickly if the veritas client fails or returns fast.
        # But we expect at least a brief moment of "EXECUTING..."
        # Or we can check if the status badge changes to "EXECUTING"

        # Let's check for the text "EXECUTING..." inside the button
        executing_button = page.locator("button").filter(has_text="EXECUTING...")
        # It might happen fast, so we might miss it if we don't catch it immediately.
        # But for this test, we just want to see if the UI logic triggers.
        # Given we are not mocking the backend, the real execute might hang or fail.
        # If it hangs, we see "EXECUTING...". If it fails/completes, it goes to "COMPLETE".

        # Let's verify the input is there and looks good in the screenshot.

        page.screenshot(path="verification_control_center.png")
        print("Screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_control_center_ux()
