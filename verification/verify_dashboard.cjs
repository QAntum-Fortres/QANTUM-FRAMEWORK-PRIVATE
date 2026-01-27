const { chromium } = require('playwright');
const path = require('path');

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Open the file
    const filePath = path.resolve(process.cwd(), 'docs/vortex-dashboard.html');
    console.log('Opening:', filePath);
    await page.goto('file://' + filePath);

    // Wait for connection (Online or Simulation)
    console.log('Waiting for connection...');
    try {
        await page.waitForSelector('#connection-status:has-text("NERVE CENTER ONLINE")', { timeout: 5000 });
    } catch {
        console.log('Nerve Center not found. Checking for Simulation Mode...');
        await page.waitForSelector('#connection-status:has-text("SIMULATION MODE")', { timeout: 5000 });
    }

    // Click Activate
    console.log('Clicking Activate...');
    await page.click('button:has-text("ACTIVATE VERITAS SWARM")');

    // Wait for logs to appear (Offline Simulation messages)
    console.log('Waiting for logs...');
    try {
        await page.waitForSelector('#audit-log:has-text("[GOAL] Initiated")', { timeout: 2000 });
    } catch {
        // Fallback for simulation mode logs
         await page.waitForSelector('#audit-log:has-text("Initializing Swarm Protocol...")', { timeout: 5000 });
    }

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
