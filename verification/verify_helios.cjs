const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const filePath = path.resolve('apps/helios-ui/dist/index.html');
    await page.goto(`file://${filePath}`);

    // Take a screenshot
    await page.screenshot({ path: 'verification/helios_dashboard.png', fullPage: true });

    await browser.close();
})();
