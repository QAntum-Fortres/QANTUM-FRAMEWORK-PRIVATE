import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as readline from 'readline';

// --- DATA STRUCTURES (Must match Rust Core) ---

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    confidence: number;
}

export interface VisionRequest {
    screenshot_base64: string;
    intent_prompt: string;
    confidence_threshold: number;
}

export interface VisionResult {
    found: boolean;
    primary_location: BoundingBox | null;
    all_found_elements: BoundingBox[];
    heatmap_base64: string | null;
    semantic_embedding: number[];
    reasoning: string;
    processing_time_ms: number;
}

export interface HealRequest {
    failed_selector: string;
    last_known_embedding: number[];
    screenshot: string;
    dom_snapshot: string;
}

export interface HealResult {
    healed: boolean;
    suggested_selector: string;
    confidence_score: number;
    embedding_distance: number;
    reason: string;
}

export interface GoalRequest {
    natural_language_goal: string;
    environment_url: string;
}

export interface AgentStep {
    step_id: number;
    action: string;
    target: string;
    observation: string;
    reasoning: string;
    duration_ms: number;
    screenshot_at_step: string | null;
}

export interface GoalResult {
    success: boolean;
    execution_graph: AgentStep[];
    singularity_audit_log: string;
    total_duration_ms: number;
}

export interface ObserverRequest {
    url: string;
    timeout_ms: number;
}

export interface ObserverState {
    stable: boolean;
    network_idle: boolean;
    layout_shift_score: number;
    dom_mutation_rate: number;
    amniotic_state_score: number;
    reason: string;
}

export interface SwarmRequest {
    agent_count: number;
    regions: string[];
    test_suite_id: string;
}

export interface SwarmStatus {
    active_agents: number;
    completed_tasks: number;
    throughput_tps: number;
    region_health: Record<string, string>;
    average_latency_ms: number;
    singularity_mesh_id: string;
}

// --- VERITAS BRIDGE ---

export class VeritasBridge {
    private process: ChildProcess | null = null;
    private rl: readline.Interface | null = null;
    private responseQueue: Array<(data: any) => void> = [];

    constructor() {
        this.startCore();
    }

    private startCore() {
        // Check for release build first, then debug
        // Resolve paths relative to this file: AETERNAAA/OmniCore/services/veritas/Bridge.ts
        // lwas_core is at: ../../../../lwas_core
        const releasePath = path.resolve(__dirname, '../../../../lwas_core/target/release/veritas_core');
        const debugPath = path.resolve(__dirname, '../../../../lwas_core/target/debug/veritas_core');

        let binaryPath = releasePath;
        const fs = require('fs');
        if (!fs.existsSync(releasePath)) {
            console.log(`[VERITAS] Release binary not found, falling back to debug: ${debugPath}`);
            binaryPath = debugPath;
        }

        console.log(`[VERITAS] Spawning Core: ${binaryPath}`);

        try {
            this.process = spawn(binaryPath);

            this.process.on('error', (err) => {
                console.error(`[VERITAS] Failed to spawn Rust core: ${err.message}`);
                console.error(`[VERITAS] Ensure you have run 'cd AETERNAAA/lwas_core && cargo build --release'`);
                this.process = null;
            });

            this.process.on('exit', (code, signal) => {
                if (code !== 0 && code !== null) {
                    console.warn(`[VERITAS] Core exited with code ${code}`);
                }
            });

        } catch (err) {
            console.error('[VERITAS] Unexpected error spawning core:', err);
            return;
        }

        this.process.stderr?.on('data', (data) => {
            console.error(`[VERITAS CORE ERR]: ${data}`);
        });

        if (this.process.stdout) {
            this.rl = readline.createInterface({
                input: this.process.stdout,
                terminal: false
            });

            this.rl.on('line', (line) => {
                if (this.responseQueue.length > 0) {
                    const resolver = this.responseQueue.shift();
                    try {
                        const parsed = JSON.parse(line);
                        resolver && resolver(parsed);
                    } catch (e) {
                        console.error('[VERITAS] Failed to parse JSON from core:', line);
                    }
                }
            });
        }
    }

    public async locate(screenshot_base64: string, intent_prompt: string, confidence_threshold: number = 0.8): Promise<VisionResult> {
        return this.sendCommand('Locate', { screenshot_base64, intent_prompt, confidence_threshold });
    }

    public async heal(failed_selector: string, screenshot: string, dom_snapshot: string, last_known_embedding: number[]): Promise<HealResult> {
         return this.sendCommand('Heal', { failed_selector, screenshot, dom_snapshot, last_known_embedding });
    }

    public async goal(natural_language_goal: string, environment_url: string): Promise<GoalResult> {
        return this.sendCommand('Goal', { natural_language_goal, environment_url });
    }

    public async observe(url: string, timeout_ms: number = 5000): Promise<ObserverState> {
        return this.sendCommand('Observe', { url, timeout_ms });
    }

    public async swarm(agent_count: number, regions: string[], test_suite_id: string): Promise<SwarmStatus> {
        return this.sendCommand('Swarm', { agent_count, regions, test_suite_id });
    }

    private async sendCommand(commandName: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.process || !this.process.stdin) {
                return reject(new Error("[VERITAS] Core process is not running."));
            }

            // Match SecureCommand structure in Rust
            const secureCmd = {
                auth_token: "valid_token", // Mock token
                user_id: "admin",          // Mock user
                command: {
                    command: commandName,
                    payload: payload
                }
            };
            const msg = JSON.stringify(secureCmd);

            try {
                this.process.stdin.write(msg + '\n');
            } catch (err) {
                return reject(err);
            }

            this.responseQueue.push((response: any) => {
                if (response.status === 'success') {
                    resolve(response.data);
                } else {
                    reject(new Error(response.error || 'Unknown Error'));
                }
            });
        });
    }

    public kill() {
        this.process?.kill();
    }
}
