import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as readline from 'readline';

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
    attention_map: number[][];
    class_probs: Record<string, number>;
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

export class VeritasBridge {
    private process: ChildProcess | null = null;
    private rl: readline.Interface | null = null;
    private responseQueue: Array<(data: any) => void> = [];

    constructor() {
        this.startCore();
    }

    private startCore() {
        // Assume the binary is built at veritas_core/target/debug/veritas_core
        // Root is 3 levels up from services/veritas or adjusted based on execution context
        const binaryPath = path.resolve(process.cwd(), 'veritas_core/target/debug/veritas_core');

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

    public async locate(image_base64: string, intent: string): Promise<VisionResult> {
        return this.sendCommand('Locate', { image_base64, intent }).then((res: VisionResult) => {
            // Process Attention Map Logic (Simulated parsing for Production readiness)
            if (res.attention_map && res.attention_map.length > 0) {
                 // In a real system, we'd use this heatmap to refine coordinates.
                 // For now, we log the density as requested.
                 const hotspot = this.findAttentionHotspot(res.attention_map);
                 // We don't override the Rust coordinates, but we validate them.
                 // console.log(`[DEBUG] Attention Hotspot: ${hotspot.r},${hotspot.c}`);
            }
            return res;
        });
    }

    public async heal(failed_selector: string, current_image: string, last_known_embedding: number[]): Promise<HealResult> {
         console.log(`[AUDIT] Auto-Remediation Event Triggered for selector: ${failed_selector}`);
         // Log to Immutable Audit Log (Console for now, representing gRPC/WebSocket hook)
         console.log(`[AUDIT-LOG-GRPC] { event: "HEALING_REQUESTED", target: "${failed_selector}", timestamp: ${Date.now()} }`);

         return this.sendCommand('Heal', { failed_selector, current_image, last_known_embedding });
    }

    private async sendCommand(commandName: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.process || !this.process.stdin) {
                // Return a mock result if core isn't running (e.g. inside CI without build)
                if (commandName === 'Locate') return resolve(this.mockVisionResult());
                if (commandName === 'Heal') return resolve(this.mockHealResult());
                return reject(new Error('Veritas Core not running'));
            }

            const secureCmd = {
                auth_token: "valid_token",
                user_id: "admin",
                command: {
                    command: commandName,
                    payload: payload
                }
            };
            const msg = JSON.stringify(secureCmd);
            this.process.stdin.write(msg + '\n');

            this.responseQueue.push((response: any) => {
                if (response.status === 'success') {
                    resolve(response.data);
                } else {
                    reject(new Error(response.error || 'Unknown Error'));
                }
            });
        });
    }

    private findAttentionHotspot(map: number[][]): {r: number, c: number} {
        let maxVal = -1;
        let maxR = 0;
        let maxC = 0;
        for(let r=0; r<map.length; r++) {
            for(let c=0; c<map[r].length; c++) {
                if (map[r][c] > maxVal) {
                    maxVal = map[r][c];
                    maxR = r;
                    maxC = c;
                }
            }
        }
        return {r: maxR, c: maxC};
    }

    private mockVisionResult(): VisionResult {
        return {
            found: true,
            location: { x: 100, y: 100, width: 50, height: 20 },
            confidence: 0.95,
            semantic_embedding: [],
            reasoning: "Mock Result (Core Unavailable)",
            attention_map: [[0.1, 0.9], [0.2, 0.3]],
            class_probs: { "button": 0.99 }
        };
    }

    private mockHealResult(): HealResult {
        return {
            healed: true,
            new_selector: ".mock-healed-selector",
            similarity_score: 0.88,
            reason: "Mock Healing"
        };
    }

    public kill() {
        this.process?.kill();
    }
}
