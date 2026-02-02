/**
 * VERITAS AUTONOMOUS AGENT
 * Implements Goal-Oriented Agency using Vision-Transformer (ViT) bridges.
 */
import { VeritasBridge, VisionResult, GoalResult } from './Bridge.ts';

export interface AgentGoal {
    description: string;
}

export class AutonomousAgent {
    private bridge: VeritasBridge;
    private name: string;

    constructor(name: string = "Veritas-Agent-001") {
        this.bridge = new VeritasBridge();
        this.name = name;
    }

    public async executeGoal(goal: AgentGoal): Promise<GoalResult> {
        console.log(`[${this.name}] Received Goal: "${goal.description}"`);
        console.log(`[${this.name}] Delegating execution to Veritas Core (Rust)...`);

        try {
            const result = await this.bridge.executeGoal(goal.description);

            console.log(`[${this.name}] Goal Execution Complete. Success: ${result.success}`);
            console.log(`[${this.name}] Audit Log: ${result.audit_log_url}`);

            result.steps.forEach(step => {
                console.log(`  > [${step.action}] -> ${step.observation} (${step.duration_ms}ms)`);
            });

            return result;
        } catch (error) {
            console.error(`[${this.name}] Execution Failed:`, error);
            throw error;
        }
    }

    public async locateVisualIntent(intent: string): Promise<VisionResult> {
        // Mock screenshot for demo purposes
        const mockScreenshot = "base64_mock_data...";
        return this.bridge.locate(mockScreenshot, intent);
    }

    public shutdown() {
        this.bridge.kill();
    }
}
