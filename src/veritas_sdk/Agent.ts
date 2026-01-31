/**
 * VERITAS AUTONOMOUS AGENT
 * Implements Goal-Oriented Agency using Veritas Core (Rust) for cognitive processing.
 */
import { VeritasBridge, GoalResult } from './Bridge.ts';

export class AutonomousAgent {
    private bridge: VeritasBridge;
    private name: string;

    constructor(name: string = "Veritas-Agent-001") {
        this.bridge = new VeritasBridge();
        this.name = name;
    }

    public async executeGoal(goalDescription: string): Promise<GoalResult> {
        console.log(`[${this.name}] Received Goal: "${goalDescription}"`);
        console.log(`[${this.name}] Offloading cognitive load to Veritas Core (Rust)...`);

        const result = await this.bridge.executeGoal(goalDescription);

        console.log(`[${this.name}] Goal Execution Complete. Success: ${result.success}`);

        result.steps.forEach((step, index) => {
            console.log(`\n--- STEP ${index + 1} ---`);
            console.log(`[ACTION]    ${step.action}`);
            console.log(`[OBSERVE]   ${step.observation}`);
            console.log(`[REASON]    ${step.reasoning}`);
            console.log(`[DURATION]  ${step.duration_ms}ms`);
        });

        console.log(`\n[AUDIT] Singularity Log available at: ${result.audit_log_url}`);

        return result;
    }

    public shutdown() {
        this.bridge.kill();
    }
}
