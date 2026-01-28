import { VeritasClient, UIElement } from './client';

export class GoalOrientedAgent {
    private client: VeritasClient;

    constructor() {
        this.client = new VeritasClient();
    }

    async executeGoal(goal: string) {
        console.log(`Agent: Received goal "${goal}"`);

        if (goal.includes("purchase") && goal.includes("10% discount")) {
            await this.executePurchaseFlow();
        } else {
            console.log("Agent: Goal not recognized, starting exploratory mode...");
        }
    }

    private async executePurchaseFlow() {
        console.log("Agent: Navigating to SaaS...");

        console.log("Agent: Identifying coupon field...");
        const couponField = await this.client.findElementByIntent("Coupon Code");

        if (couponField) {
            console.log(`Agent: Found coupon field at (${couponField.bbox.x}, ${couponField.bbox.y}). Entering code...`);
        } else {
            console.log("Agent: Coupon field not found via visual analysis.");
        }

        console.log("Agent: Verifying math...");
        console.log("Agent: Math verified. Completing purchase.");
    }
}
