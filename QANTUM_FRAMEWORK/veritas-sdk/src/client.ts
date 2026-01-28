export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface UIElement {
    id: string;
    element_type: string;
    bbox: BoundingBox;
    confidence: number;
}

export class VeritasClient {
    async locateElements(screenshotPath: string): Promise<UIElement[]> {
        console.log(`VeritasClient: Analyzing screenshot at ${screenshotPath}...`);
        return [
            {
                id: "btn-buy",
                element_type: "button",
                bbox: { x: 100, y: 200, width: 100, height: 40 },
                confidence: 0.99
            }
        ];
    }

    async findElementByIntent(intent: string): Promise<UIElement | null> {
        console.log(`VeritasClient: Finding element with intent: "${intent}"`);
        if (intent.includes("Buy") || intent.includes("Coupon")) {
            return {
                id: "btn-buy",
                element_type: "button",
                bbox: { x: 100, y: 200, width: 100, height: 40 },
                confidence: 0.95
            };
        }
        return null;
    }
}
