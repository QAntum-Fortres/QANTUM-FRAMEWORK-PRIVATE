import { VeritasBridge } from './Bridge.ts';
import type { VisionResult, VisionRequest } from './types.ts';

export class NeuralLocator {
    private bridge: VeritasBridge;

    constructor(bridge?: VeritasBridge) {
        this.bridge = bridge || new VeritasBridge();
    }

    /**
     * Locates a UI element based on visual intent using the Vision-Transformer Layer.
     * @param imageBase64 The current screenshot in Base64 format.
     * @param intent The natural language description of what to find (e.g., "Checkout Button").
     */
    public async locate(imageBase64: string, intent: string): Promise<VisionResult> {
        console.log(`[NeuralLocator] Analyzing image for intent: "${intent}"`);
        return this.bridge.locate(imageBase64, intent);
    }

    /**
     * Terminates the underlying bridge connection.
     */
    public disconnect() {
        this.bridge.kill();
    }
}
