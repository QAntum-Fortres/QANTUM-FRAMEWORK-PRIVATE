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
        // Check for release build first, then debug
        // Resolve paths relative to this file: AETERNAAA/OmniCore/services/veritas/Bridge.ts
        // lwas_core is at: AETERNAAA/lwas_core
        // This file is 3 levels deep inside OmniCore (services/veritas)
        // So we go up 3 levels to OmniCore root, then 1 level up to AETERNAAA root
        // Total 4 levels up? No, wait:
        // __dirname = .../AETERNAAA/OmniCore/services/veritas
        // ../ = .../AETERNAAA/OmniCore/services
        // ../../ = .../AETERNAAA/OmniCore
        // ../../../ = .../AETERNAAA
        // So lwas_core is at ../../../lwas_core
        const releasePath = path.resolve(__dirname, '../../../lwas_core/target/release/veritas_core');
        const debugPath = path.resolve(__dirname, '../../../lwas_core/target/debug/veritas_core');

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

    public async locate(image_base64: string, intent: string): Promise<VisionResult> {
        return this.sendCommand('Locate', { image_base64, intent });
    }

    public async heal(failed_selector: string, current_image: string, last_known_embedding: number[]): Promise<HealResult> {
         return this.sendCommand('Heal', { failed_selector, current_image, last_known_embedding });
    }

    private async sendCommand(commandName: string, payload: any): Promise<any> {
        return new Promise((resolve, reject) => {
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
