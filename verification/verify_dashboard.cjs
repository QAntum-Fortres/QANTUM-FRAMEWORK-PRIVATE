const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const filePath = path.resolve('QANTUM_SAAS_PLATFORM/dashboard/index.html');
    await page.goto(`file://${filePath}`);

    // Take a screenshot
    await page.screenshot({ path: 'verification/dashboard.png', fullPage: true });

    await browser.close();
})();
