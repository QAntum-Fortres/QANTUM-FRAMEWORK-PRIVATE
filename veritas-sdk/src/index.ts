import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as readline from 'readline';

export interface VeritasConfig {
    corePath?: string;
    authToken?: string;
    userId?: string;
}

export class VeritasClient {
    private process: ChildProcess | null = null;
    private corePath: string;
    private authToken: string;
    private userId: string;
    private rl: readline.Interface | null = null;
    private responseQueue: Array<(response: any) => void> = [];

    constructor(config: VeritasConfig = {}) {
        // Default to finding the binary in the sibling veritas_core directory
        // Use process.cwd() to be safe in different environments
        this.corePath = config.corePath || path.resolve(process.cwd(), 'veritas_core/target/debug/veritas_core');
        this.authToken = config.authToken || 'valid_token';
        this.userId = config.userId || 'admin';
    }

    public async start(): Promise<void> {
        console.log(`[SDK] Starting Veritas Core from: ${this.corePath}`);
        this.process = spawn(this.corePath, [], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        if (!this.process.stdout || !this.process.stdin) {
            throw new Error("Failed to spawn Veritas Core process with pipes.");
        }

        this.process.on('error', (err) => {
            console.error(`[SDK] Failed to start process: ${err.message}`);
        });

        this.process.stderr?.on('data', (data) => {
            console.error(`[CORE STDERR] ${data}`);
        });

        this.rl = readline.createInterface({
            input: this.process.stdout,
            terminal: false
        });

        this.rl.on('line', (line) => {
            if (line.trim()) {
                try {
                    const response = JSON.parse(line);
                    const resolver = this.responseQueue.shift();
                    if (resolver) {
                        resolver(response);
                    }
                } catch (e) {
                    console.error(`[SDK] Failed to parse response: ${line}`);
                }
            }
        });

        // Ping to verify
        // Ping is a unit variant, so payload should be ignored or not present in adjacently tagged
        const pong = await this.sendCommand('Ping');
        if (pong.status !== 'success') {
            throw new Error(`[SDK] Failed to connect to Veritas Core: ${JSON.stringify(pong)}`);
        }
        console.log("[SDK] Veritas Core Connected.");
    }

    private sendCommand(commandType: string, payload: any = null): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.process || !this.process.stdin) {
                return reject(new Error("Veritas Core not running. Call start() first."));
            }

            // Construct the inner Command enum based on Serde's adjacently tagged representation:
            // #[serde(tag = "command", content = "payload")]
            let commandObj;
            if (commandType === 'Ping') {
                commandObj = { command: 'Ping' };
            } else {
                commandObj = { command: commandType, payload: payload };
            }

            const secureCommand = {
                auth_token: this.authToken,
                user_id: this.userId,
                command: commandObj
            };

            this.responseQueue.push(resolve);
            this.process.stdin.write(JSON.stringify(secureCommand) + '\n');
        });
    }

    public async stop(): Promise<void> {
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
    }

    // --- API Surface ---

    public get visual() {
        return {
            locate: async (intent: string, imageBase64: string = "placeholder_base64") => {
                return this.sendCommand('Locate', { intent, image_base64: imageBase64 });
            }
        };
    }

    public get agent() {
        return {
            goal: async (goal: string) => {
                return this.sendCommand('Goal', { goal });
            },
            heal: async (failedSelector: string) => {
                 return this.sendCommand('Heal', {
                     failed_selector: failedSelector,
                     last_known_embedding: [],
                     current_image: "placeholder"
                });
            }
        };
    }

    public get observer() {
        return {
            check: async (url: string) => {
                return this.sendCommand('Observe', { url });
            }
        };
    }

    public get swarm() {
        return {
            launch: async (count: number, regions: string[]) => {
                return this.sendCommand('Swarm', { agent_count: count, regions });
            }
        };
    }
}
