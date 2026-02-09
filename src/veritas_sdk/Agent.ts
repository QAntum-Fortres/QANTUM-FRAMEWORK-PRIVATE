import { VeritasBridge } from './Bridge.ts';
import { NeuralLocator } from './NeuralLocator.ts';
import type { AgentStep, VisionResult } from './types.ts';

export class AutonomousAgent {
    private bridge: VeritasBridge;
    private locator: NeuralLocator;
    private name: string;

    constructor(name: string = "Veritas-Agent-001") {
        this.bridge = new VeritasBridge();
        this.locator = new NeuralLocator(this.bridge);
        this.name = name;
    }

    public async executeGoal(goalDescription: string): Promise<void> {
        console.log(`[${this.name}] Received Goal: "${goalDescription}"`);

        const history: AgentStep[] = [];
        let done = false;
        let steps_taken = 0;
        const max_steps = 20; // Safety break

        while (!done && steps_taken < max_steps) {
            steps_taken++;
            // Mock state summary - in a real app, this comes from DOM/Accessibility Tree/Observer
            const current_state_summary = "User is interacting with the application.";

            try {
                // Ask Core for the next step based on history
                const plan = await this.bridge.planGoal(goalDescription, history, current_state_summary);

                if (plan.complete) {
                    console.log(`[${this.name}] Goal Achieved! Audit Log: ${plan.audit_log_entry}`);
                    done = true;
                } else if (plan.next_step) {
                    const step = plan.next_step;
                    console.log(`[${this.name}] 🧠 Planned Action: ${step.action}`);
                    console.log(`[${this.name}]    Reasoning: ${step.reasoning}`);

                    // Simulate Vision Check for the action
                    // If action involves clicking/finding something, we use NeuralLocator
                    const mockScreenshot = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";

                    // We interpret the action string as the intent for the visual locator
                    const visionResult = await this.locator.locate(mockScreenshot, step.action);

                    if (visionResult.found && visionResult.location) {
                         console.log(`[${this.name}] 👁️ Visually Verified Target.`);
                         // Update observation with success details
                         step.observation = `Success. Found target at [${visionResult.location.x}, ${visionResult.location.y}]. ${visionResult.reasoning}`;
                    } else {
                         console.warn(`[${this.name}] ⚠️ Visual Check Failed.`);
                         step.observation = "Could not visually locate target. Action attempted blindly.";
                    }

                    // Add to history so the Core knows what happened for the next iteration
                    history.push(step);

                    // Simulate execution time
                    await new Promise(r => setTimeout(r, 100));
                } else {
                    console.warn(`[${this.name}] Core returned no plan and not complete. Stopping.`);
                    done = true;
                }
            } catch (e) {
                console.error(`[${this.name}] Planning Error:`, e);
                done = true;
            }
        }

        if (steps_taken >= max_steps) {
            console.warn(`[${this.name}] Max steps reached. Aborting.`);
        }
    }

    public shutdown() {
        this.bridge.kill();
    }
}
