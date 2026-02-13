from playwright.sync_api import sync_playwright, expect

def verify_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to App...")
        page.goto("http://localhost:5173")

        # Take initial screenshot of default view
        page.screenshot(path="verification_initial_view.png")

        # Switch to VORTEX UI
        print("Switching to Vortex UI...")
        # The button text is "VORTEX UI"
        page.get_by_text("VORTEX UI", exact=True).click()

        # Wait for transition
        page.wait_for_timeout(1000)

        # Verify Veritas Control Center is visible
        print("Verifying Veritas Control Center...")
        expect(page.get_by_text("VERITAS COGNITIVE QA v1.0")).to_be_visible()

        # Take screenshot of Dashboard
        page.screenshot(path="verification_dashboard.png")
        print("Dashboard screenshot taken.")

        # Click Trigger Neural Locator
        print("Triggering Neural Locator...")
        # Button text might be inside
        page.get_by_text("TRIGGER NEURAL LOCATOR").click()

        # Wait for analysis to complete (mock delay ~1.5s)
        page.wait_for_timeout(3000)

        # Verify result appears
        expect(page.get_by_text("CANDIDATES")).to_be_visible()
        expect(page.get_by_text("AMNIOTIC STATE")).to_be_visible() # Added in my changes

        # Take screenshot of Vision Result + Heatmap
        page.screenshot(path="verification_vision.png")
        print("Vision screenshot taken.")

        # Launch Swarm
        print("Launching Swarm...")
        page.get_by_role("button", name="SWARM").click()

        # Wait for Swarm logs (mock delay ~1.5s)
        page.wait_for_timeout(3000)

        # Verify Swarm status
        expect(page.get_by_text("DISTRIBUTED SWARM ACTIVE")).to_be_visible()

        # Take screenshot of Swarm Result
        page.screenshot(path="verification_swarm.png")
        print("Swarm screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_dashboard()
