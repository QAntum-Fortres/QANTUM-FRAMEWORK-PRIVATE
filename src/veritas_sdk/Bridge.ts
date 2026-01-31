import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- INTERFACES ---

export interface VisionRequest {
    image_base64: string;
    intent: string;
}

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface VisionResult {
    found: boolean;
    location: BoundingBox | null;
    confidence: number;
    semantic_embedding: number[];
    reasoning: string;
}

export interface HealRequest {
    failed_selector: string;
    last_known_embedding: number[];
    current_image: string;
}

export interface HealResult {
    healed: boolean;
    new_selector: string;
    similarity_score: number;
    reason: string;
}

export interface GoalRequest {
    goal: string;
}

export interface AgentStep {
    action: string;
    observation: string;
    reasoning: string;
    duration_ms: number;
}

export interface GoalResult {
    success: boolean;
    steps: AgentStep[];
    audit_log_url: string;
}

export interface PerformanceMetrics {
    layout_shifts: number;
    network_requests_inflight: number;
    dom_nodes: number;
    fps: number;
}

export interface ObserverRequest {
    metrics: PerformanceMetrics;
}

export interface ObserverResult {
    is_stable: boolean;
    amniotic_state_score: number;
    message: string;
}

export interface SwarmRequest {
    agent_count: number;
    regions: string[];
    network_profiles: string[];
}

export interface SwarmResult {
    deployment_id: string;
    active_agents: number;
    regions_covered: string[];
    status: string;
}

// --- BRIDGE ---

export class VeritasBridge {
    private process: ChildProcess | null = null;
    private rl: readline.Interface | null = null;
    private responseQueue: Array<(data: any) => void> = [];

    constructor() {
        this.startCore();
    }

    private startCore() {
        // Assume the binary is built at veritas_core/target/debug/veritas_core
        const binaryPath = path.resolve(__dirname, '../../veritas_core/target/debug/veritas_core');

        console.log(`[VERITAS] Spawning Core: ${binaryPath}`);

        try {
            this.process = spawn(binaryPath);

            this.process.on('error', (err) => {
                console.error(`[VERITAS] Failed to spawn Rust core: ${err.message}`);
                console.error(`[VERITAS] Ensure you have run 'cd veritas_core && cargo build'`);
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

    // --- COMMANDS ---

    public async locate(image_base64: string, intent: string): Promise<VisionResult> {
        return this.sendCommand('Locate', { image_base64, intent });
    }

    public async heal(failed_selector: string, current_image: string, last_known_embedding: number[]): Promise<HealResult> {
         return this.sendCommand('Heal', { failed_selector, current_image, last_known_embedding });
    }

    public async executeGoal(goal: string): Promise<GoalResult> {
        return this.sendCommand('Goal', { goal });
    }

    public async observe(metrics: PerformanceMetrics): Promise<ObserverResult> {
        return this.sendCommand('Observe', { metrics });
    }

    public async launchSwarm(agent_count: number, regions: string[], network_profiles: string[]): Promise<SwarmResult> {
        return this.sendCommand('Swarm', { agent_count, regions, network_profiles });
    }

    private async sendCommand(commandName: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            const secureCmd = {
                auth_token: "valid_token",
                user_id: "admin",
                command: {
                    command: commandName,
                    payload: payload
                }
            };
            const msg = JSON.stringify(secureCmd);
            this.process?.stdin?.write(msg + '\n');

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
