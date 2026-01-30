/**
 * Basic QAntum Client Usage Example
 * 
 * This demonstrates the basic features of the QAntum framework
 */

import QantumClient from '../QantumClient';

async function main() {
  console.log('🚀 QAntum Client - Basic Usage Example\n');

  // Initialize QAntum client with options
  const qantum = new QantumClient({
    headless: false,      // Show browser for demo
    aiMode: true,         // Enable AI-powered element selection
    selfHealing: true,    // Enable self-healing tests
    timeout: 30000,       // 30 second timeout
  });

  try {
    // Launch the browser
    console.log('📖 Launching browser...');
    await qantum.launch();

    // Create a new page
    console.log('📄 Creating new page...');
    const page = await qantum.newPage();

    // Navigate to a website
    console.log('🌐 Navigating to example.com...');
    await page.goto('https://example.com');

    // Get the page title using smart selector
    console.log('📝 Getting page title...');
    const title = await page.getText('h1');
    console.log('   Title:', title);

    // Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ path: 'example-basic.png', fullPage: true });
    console.log('   Screenshot saved to: example-basic.png');

    // Get performance metrics
    console.log('⚡ Getting performance metrics...');
    const metrics = await page.getPerformanceMetrics();
    console.log('   Load time:', metrics.loadTime, 'ms');
    console.log('   DOM content loaded:', metrics.domContentLoaded, 'ms');
    console.log('   First paint:', metrics.firstPaint, 'ms');
    console.log('   Time to interactive:', metrics.timeToInteractive, 'ms');

    // Get all actions performed
    const actions = page.getActions();
    console.log('\n📊 Actions performed:', actions);

    // Get statistics
    const stats = qantum.getStats();
    console.log('\n📈 Statistics:', stats);

    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Clean up
    console.log('\n🧹 Cleaning up...');
    await qantum.close();
    console.log('✨ Done!');
  }
}

// Run the example
main().catch(console.error);
