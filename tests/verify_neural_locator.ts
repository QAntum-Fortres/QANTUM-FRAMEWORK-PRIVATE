import { NeuralLocator } from '../src/veritas_sdk/NeuralLocator.ts';

async function main() {
    console.error("STARTING TEST");
    try {
        const locator = new NeuralLocator();
        console.error("LOCATOR CREATED");

        // Mock Image (1x1 transparent pixel)
        const mockImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
        const intent = "Find the Checkout Button";

        console.error("SENDING REQUEST");
        const result = await locator.locate(mockImage, intent);
        console.error("RESULT RECEIVED");
        console.log(JSON.stringify(result, null, 2));

        if (result.processing_time_ms === undefined) {
            throw new Error("Missing 'processing_time_ms' in result");
        }
        if (!result.candidates) {
            throw new Error("Missing 'candidates' in result");
        }
        if (!result.heatmap_data) {
             throw new Error("Missing 'heatmap_data' in result");
        }

        console.log("Verification Successful: All fields present.");
        locator.disconnect();
        process.exit(0);

    } catch (err) {
        console.error("Verification Failed:", err);
        process.exit(1);
    }
}

main();
