const { chromium } = require('playwright');
const path = require('path');

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Open the file
    // Dashboard is in the root of the repo (2 levels up from AETERNAAA/workers)
    const filePath = path.resolve(__dirname, '../../dashboard.html');
    console.log('Opening:', filePath);
    await page.goto('file://' + filePath);

    // Wait for connection
    console.log('Waiting for connection...');
    await page.waitForSelector('#connection-status:has-text("NERVE CENTER ONLINE")', { timeout: 10000 });

    // Click Activate
    console.log('Clicking Activate...');
    await page.click('button:has-text("ACTIVATE VERITAS SWARM")');

    // Wait for logs to appear
    console.log('Waiting for logs...');
    await page.waitForSelector('#audit-log:has-text("[GOAL] Initiated")', { timeout: 5000 });

    // Wait a bit for more logs (async goal execution)
    await page.waitForTimeout(2000);

    // Take screenshot
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'verification/dashboard_verified.png', fullPage: true });

    await browser.close();
    console.log('Done.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
