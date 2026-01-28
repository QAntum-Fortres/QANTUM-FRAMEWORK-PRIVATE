const { chromium } = require('playwright');
const path = require('path');

(async () => {
  try {
    console.log('[HELIOS] Verification Script Started (Assumes Server Running)');

    const browser = await chromium.launch();
    const page = await browser.newPage();

    console.log('[HELIOS] Navigating to http://localhost:5173');
    await page.goto('http://localhost:5173');

    console.log('[HELIOS] Waiting for Dashboard Title...');
    await page.waitForSelector('h1:has-text("HELIOS UI // DASHBOARD")', { timeout: 10000 });

    console.log('[HELIOS] Waiting for Metrics (Mock Data)...');
    await page.waitForSelector('div:has-text("243")'); // Active Nodes
    await page.waitForSelector('div:has-text("0.12")'); // Entropy Level
    await page.waitForSelector('div:has-text("OPERATIONAL")'); // Status

    console.log('[HELIOS] Taking Screenshot...');
    await page.screenshot({ path: 'AETERNAAA/workers/helios_verified.png', fullPage: true });

    await browser.close();
    console.log('[HELIOS] Verification Complete.');
    process.exit(0);
  } catch (e) {
    console.error('[HELIOS] Verification Failed:', e);
    process.exit(1);
  }
})();
