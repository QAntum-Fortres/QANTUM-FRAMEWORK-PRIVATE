from playwright.sync_api import sync_playwright

def verify(page):
    print("Navigating to http://localhost:5173")
    page.goto("http://localhost:5173")

    # Wait for the navigation bar
    print("Waiting for navigation bar...")
    page.wait_for_selector("nav")

    # Click the "VERITAS QA" button
    print("Clicking VERITAS QA...")
    page.get_by_role("button", name="VERITAS QA").click()

    # Wait for dashboard to appear (look for "Singularity Audit Log" heading)
    print("Waiting for Singularity Audit Log...")
    page.get_by_role("heading", name="Singularity Audit Log").wait_for(timeout=5000)

    # Take screenshot
    print("Taking screenshot...")
    page.screenshot(path="verification_veritas_dashboard.png")
    print("Screenshot taken")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify(page)
        except Exception as e:
            print(f"Error: {e}")
            try:
                page.screenshot(path="verification_error.png")
                print("Error screenshot taken")
            except:
                pass
        finally:
            browser.close()
