const { chromium } = require('playwright');
const path = require('path');

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Open the file
    const filePath = path.resolve(process.cwd(), 'docs/enterprise-dashboard.html');
    console.log('Opening:', filePath);
    await page.goto('file://' + filePath);

    // Wait for connection (Online or Simulation)
    console.log('Waiting for connection...');
    try {
        await page.waitForSelector('#connection-status:has-text("SYSTEM ONLINE")', { timeout: 5000 });
    } catch {
        console.log('Backend not found. Checking for Simulation Mode...');
        await page.waitForSelector('#connection-status:has-text("SIMULATION MODE")', { timeout: 5000 });
    }

    // Click Audit Button
    console.log('Running Audit...');
    await page.click('button:has-text("Run Compliance Audit")');

    // Wait for logs to appear
    console.log('Waiting for logs...');
    await page.waitForSelector('.log-entry:has-text("Initiating Manual Compliance Audit")', { timeout: 5000 });

    // Wait a bit for grid animation
    await page.waitForTimeout(2000);

    // Take screenshot
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'verification/enterprise_dashboard_verified.png', fullPage: true });

    await browser.close();
    console.log('Done.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
