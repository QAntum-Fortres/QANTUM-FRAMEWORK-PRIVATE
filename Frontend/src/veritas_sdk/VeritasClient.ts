import { NeuralLocator } from './NeuralLocator';
import { GoalAgent } from './GoalAgent';
import { VisionRequest, GoalRequest, VisionResult, GoalResult } from './types';

export class VeritasClient {
    public locator: NeuralLocator;
    public agent: GoalAgent;

    constructor() {
        this.locator = new NeuralLocator();
        this.agent = new GoalAgent();
    }

    async locate(image: string, intent: string): Promise<VisionResult> {
        const req: VisionRequest = { image_base64: image, intent };
        return this.locator.analyze(req);
    }

    async executeGoal(goal: string): Promise<GoalResult> {
        const req: GoalRequest = { goal };
        return this.agent.execute(req);
    }
}

export const veritas = new VeritasClient();
