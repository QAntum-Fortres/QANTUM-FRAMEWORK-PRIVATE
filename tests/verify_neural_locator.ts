import { NeuralLocator } from '../src/veritas_sdk/NeuralLocator.ts';
import type { VisionResult } from '../src/veritas_sdk/types.ts';

async function main() {
    console.log("🚀 Initializing Veritas Neural Locator Verification...");

    const locator = new NeuralLocator();

    // Mock Image (small 1x1 pixel base64 png)
    const mockImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAwAB/AL+f4AAAAAASUVORK5CYII=";

    const intent = "Find the Checkout Button";

    try {
        console.log(`[TEST] Sending intent: "${intent}"`);
        const result: VisionResult = await locator.locate(mockImage, intent);

        console.log("\n✅ VISION RESULT RECEIVED:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.found) {
            console.error("❌ Test Failed: Element not found.");
            process.exit(1);
        }

        if (!result.audit_trail || result.audit_trail.length === 0) {
             console.error("❌ Test Failed: Audit trail missing.");
             process.exit(1);
        }

        console.log("\n✨ SINGULARITY AUDIT LOG (Sample):");
        result.audit_trail.forEach((log, index) => {
            console.log(`  ${index + 1}. ${log}`);
        });

        console.log("\n🎉 VERITAS Neural Locator Verification PASSED.");

    } catch (error) {
        console.error("❌ Test Failed with Error:", error);
        process.exit(1);
    } finally {
        locator.disconnect();
    }
}

main();
