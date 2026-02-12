import { chromium } from 'playwright';
import path from 'path';
import process from 'process';

async function verifyEnterpriseMode() {
  console.log('Starting Enterprise Mode Verification...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Use absolute path for file protocol
  const filePath = `file://${path.resolve(process.cwd(), 'docs/vortex-dashboard.html')}`;
  console.log(`Navigating to: ${filePath}`);

  await page.goto(filePath);

  // Wait for button
  const toggleBtn = page.getByText('🏢 Enterprise Protocol');
  await toggleBtn.waitFor();
  console.log('Found "Enterprise Protocol" button.');

  // Initial State Screenshot
  await page.screenshot({ path: 'verification/before_toggle.png' });
  console.log('Captured verification/before_toggle.png');

  // Click Toggle
  console.log('Clicking toggle button...');
  await toggleBtn.click();

  // Verify Class
  const isEnterprise = await page.evaluate(() => document.body.classList.contains('enterprise-mode'));
  if (!isEnterprise) {
    console.error('FAILED: Body does not have enterprise-mode class after toggle.');
    await browser.close();
    process.exit(1);
  }
  console.log('SUCCESS: Body has enterprise-mode class.');

  // Verify Button Text Change
  // Using a relaxed locator or waiting a bit as DOM updates might be async
  const returnBtn = page.getByText('🧪 Return to Lab');
  await returnBtn.waitFor({ state: 'visible', timeout: 2000 });
  console.log('SUCCESS: Button text changed to "Return to Lab".');

  // Capture Result
  await page.screenshot({ path: 'verification/enterprise_mode.png' });
  console.log('Captured verification/enterprise_mode.png');

  await browser.close();
  console.log('Verification Complete.');
}

verifyEnterpriseMode().catch(err => {
  console.error('Verification Script Failed:', err);
  process.exit(1);
});
