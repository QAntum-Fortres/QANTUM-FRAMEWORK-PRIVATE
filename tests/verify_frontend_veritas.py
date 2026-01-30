from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to http://localhost:5173/")
        try:
            page.goto("http://localhost:5173/", timeout=10000)

            # Wait for network idle
            page.wait_for_load_state("networkidle", timeout=5000)

            # Print title
            print(f"Page Title: {page.title()}")

            # Check for Header (specific)
            print("Checking for Header...")
            expect(page.get_by_role("heading", name="HELIOS SINGULARITY")).to_be_visible(timeout=5000)

            # Check for Veritas QA card
            print("Checking for Veritas QA card...")
            # Look for text "Veritas QA"
            expect(page.get_by_text("Veritas QA", exact=False)).to_be_visible(timeout=5000)

            print("Veritas QA Found!")

            # Check System Log
            print("Checking logs...")
            expect(page.get_by_text("Neural Locator initialized", exact=False)).to_be_visible()

            print("Taking success screenshot...")
            page.screenshot(path="verification_veritas.png", full_page=True)

            print("SUCCESS: Frontend verification passed.")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="error_screenshot.png", full_page=True)
            with open("error_page.html", "w") as f:
                f.write(page.content())
        finally:
            browser.close()

if __name__ == "__main__":
    run()
