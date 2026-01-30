/**
 * Advanced QAntum Client Usage Example
 * 
 * This demonstrates advanced features including:
 * - Smart selectors with multiple fallbacks
 * - Network interception
 * - Visual testing
 * - Form interaction
 */

import QantumClient from '../QantumClient';

async function main() {
  console.log('🚀 QAntum Client - Advanced Usage Example\n');

  const qantum = new QantumClient({
    headless: false,
    aiMode: true,
    selfHealing: true,
    recordVideo: false,
    recordTrace: false,
  });

  try {
    await qantum.launch();
    const page = await qantum.newPage();

    // Example 1: Smart Selectors with Multiple Fallbacks
    console.log('1️⃣ Testing smart selectors...');
    await page.goto('https://www.google.com');
    
    // QAntum will try multiple strategies to find the search box
    await page.type({
      testId: 'search-input',           // Try test ID first
      role: 'searchbox',                // Then try ARIA role
      placeholder: 'Search',            // Then try placeholder
      css: 'input[name="q"]',           // Then try CSS
      aiDescription: 'search input box' // Finally try AI
    }, 'QAntum Framework');

    console.log('   ✅ Successfully typed in search box using smart selector\n');

    // Example 2: Network Interception
    console.log('2️⃣ Testing network interception...');
    const networkRequests: string[] = [];
    
    await page.interceptNetwork(/.*/, (request) => {
      networkRequests.push(request.url());
    });

    await page.goto('https://example.com');
    console.log(`   ✅ Intercepted ${networkRequests.length} network requests\n`);

    // Example 3: Performance Monitoring
    console.log('3️⃣ Testing performance monitoring...');
    const metrics = await page.getPerformanceMetrics();
    
    console.log('   Performance Metrics:');
    console.log('   - Load Time:', metrics.loadTime, 'ms');
    console.log('   - DOM Content Loaded:', metrics.domContentLoaded, 'ms');
    console.log('   - First Paint:', metrics.firstPaint, 'ms');
    console.log('   - First Contentful Paint:', metrics.firstContentfulPaint, 'ms');
    console.log('   - Time to Interactive:', metrics.timeToInteractive, 'ms');
    
    if (metrics.loadTime < 2000) {
      console.log('   ✅ Page loaded quickly (< 2 seconds)\n');
    } else {
      console.log('   ⚠️  Page load time could be improved\n');
    }

    // Example 4: Visual Testing
    console.log('4️⃣ Testing visual regression...');
    const visualMatch = await page.expectVisualMatch('example-homepage', {
      threshold: 0.01 // 1% tolerance
    });
    
    if (visualMatch) {
      console.log('   ✅ Visual regression test passed\n');
    } else {
      console.log('   ⚠️  Visual differences detected\n');
    }

    // Example 5: Multiple Interaction Strategies
    console.log('5️⃣ Testing interaction with multiple strategies...');
    
    // Navigate to a page with a form
    await page.goto('https://www.wikipedia.org');
    
    // Use AI-powered element selection
    try {
      await page.type({
        aiDescription: 'search box',
        placeholder: 'Search Wikipedia',
        css: 'input[name="search"]'
      }, 'Browser automation');
      
      console.log('   ✅ Successfully interacted with Wikipedia search\n');
    } catch (error) {
      console.log('   ⚠️  Could not interact with search box\n');
    }

    // Example 6: Screenshot with full page
    console.log('6️⃣ Taking full page screenshot...');
    await page.screenshot({ 
      path: 'example-advanced.png', 
      fullPage: true 
    });
    console.log('   ✅ Screenshot saved to: example-advanced.png\n');

    // Example 7: JavaScript Evaluation
    console.log('7️⃣ Testing JavaScript evaluation...');
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
    });
    
    console.log('   Page Information:');
    console.log('   - Title:', pageInfo.title);
    console.log('   - URL:', pageInfo.url);
    console.log('   - Viewport:', pageInfo.viewport);
    console.log('   ✅ JavaScript evaluation successful\n');

    // Show statistics
    const stats = qantum.getStats();
    console.log('📊 Final Statistics:');
    console.log('   - Total Actions:', stats.totalActions);
    console.log('   - Failed Actions:', stats.failedActions);
    console.log('   - Total Duration:', stats.totalDuration, 'ms');
    console.log('   - Pages Created:', stats.pagesCreated);
    console.log('   - Success Rate:', ((1 - stats.failedActions / stats.totalActions) * 100).toFixed(2), '%');

    console.log('\n✅ All advanced tests completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await qantum.close();
    console.log('\n✨ Done!');
  }
}

main().catch(console.error);
