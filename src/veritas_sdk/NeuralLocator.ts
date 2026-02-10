import { VeritasBridge } from './Bridge.ts';
import type { VisionResult, HealResult, GoalResult, ObserverState, SwarmStatus } from './types.ts';

/**
 * The Veritas Neural Locator Engine.
 * Provides the Vision-Based Interface for the QA Framework.
 */
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
     * Attempts to heal a broken selector using Semantic Embedding Mapping.
     */
    public async heal(failedSelector: string, currentImage: string, lastKnownEmbedding: number[]): Promise<HealResult> {
        console.log(`[NeuralLocator] Healing selector: "${failedSelector}"`);
        return this.bridge.heal(failedSelector, currentImage, lastKnownEmbedding);
    }

    /**
     * Executes a high-level goal using the Autonomous Agent Brain.
     */
    public async executeGoal(goal: string): Promise<GoalResult> {
        console.log(`[NeuralLocator] Executing Goal: "${goal}"`);
        return this.bridge.goal(goal);
    }

    /**
     * Observes the Amniotic State of the UI (Zero-Wait Architecture).
     */
    public async observeState(url: string, threshold?: number): Promise<ObserverState> {
        console.log(`[NeuralLocator] Observing state for: "${url}"`);
        return this.bridge.observe(url, threshold);
    }

    /**
     * Deploys a Distributed Swarm of micro-agents.
     */
    public async deploySwarm(count: number, regions: string[], goal: string): Promise<SwarmStatus> {
        console.log(`[NeuralLocator] Deploying Swarm of ${count} agents...`);
        return this.bridge.swarm(count, regions, goal);
    }

    /**
     * Terminates the underlying bridge connection.
     */
    public disconnect() {
        this.bridge.kill();
    }
}
