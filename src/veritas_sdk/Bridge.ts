import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as readline from 'readline';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export class VeritasBridge {
    private process: ChildProcess | null = null;
    private rl: readline.Interface | null = null;
    private responseQueue: Array<(data: any) => void> = [];
    private debugMode: boolean = true;

    constructor() {
        this.startCore();
    }

    private startCore() {
        // Resolve path to the Rust binary
        // Assumes running from root or standard structure
        const binaryName = process.platform === 'win32' ? 'veritas_core.exe' : 'veritas_core';
        const binaryPath = path.resolve(__dirname, '../../veritas_core/target/debug', binaryName);

        if (this.debugMode) {
            console.log(`[VERITAS] Linking to Neural Core at: ${binaryPath}`);
        }

        if (!fs.existsSync(binaryPath)) {
             console.error(`[VERITAS] CRITICAL: Core binary not found at ${binaryPath}`);
             console.error(`[VERITAS] Please run: 'cd veritas_core && cargo build'`);
             return;
        }

        try {
            this.process = spawn(binaryPath);

            this.process.on('error', (err) => {
                console.error(`[VERITAS] Failed to spawn Rust core: ${err.message}`);
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
            // Forward Rust logs to Node console
            const log = data.toString().trim();
            if (log) console.error(`[CORE] ${log}`);
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
        return this.sendCommand('Locate', { image_base64, intent });
    }

    public async heal(failed_selector: string, current_image: string, last_known_embedding: number[]): Promise<HealResult> {
         return this.sendCommand('Heal', { failed_selector, current_image, last_known_embedding });
    }

    private async sendCommand(commandName: string, payload: any): Promise<any> {
        if (!this.process) {
            throw new Error("Veritas Core is not running.");
        }

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
