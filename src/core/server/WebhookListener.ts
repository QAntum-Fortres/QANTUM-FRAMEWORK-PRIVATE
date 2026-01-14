/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                      THE HEARTBEAT: WEBHOOK LISTENER v1.0                    ║
 * ║                   Real-time Event Processing & CI/CD Trigger                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Listens for GitHub webhooks (Push, PR) and triggers the Assimilator or
 * CodeParser for instant analysis. Makes the system "Alive".
 */

import express from 'express';
import crypto from 'crypto';
import { spawn } from 'child_process';
import path from 'path';

const app = express();
const PORT = process.env.VORTEX_WEBHOOK_PORT || 3000;
const SECRET = process.env.VORTEX_WEBHOOK_SECRET || 'vortex-secret-key';

// Use raw body for signature verification
app.use(express.json({
    verify: (req: any, res, buf) => {
        req.rawBody = buf;
    }
}));

interface WebhookPayload {
    ref?: string;
    commits?: Array<{
        id: string;
        message: string;
        added: string[];
        modified: string[];
        removed: string[];
    }>;
    repository?: {
        full_name: string;
    };
}

app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'] as string;

    if (!verifySignature(req.rawBody, signature)) {
        console.warn('[HEARTBEAT] 💔 Invalid signature received. Ignoring.');
        res.status(401).send('Invalid signature');
        return;
    }

    const payload = req.body as WebhookPayload;
    const event = req.headers['x-github-event'] as string;

    console.log(`[HEARTBEAT] 💓 Received event: ${event}`);

    if (event === 'push') {
        handlePushEvent(payload);
    } else if (event === 'ping') {
        console.log('[HEARTBEAT] 🏓 Ping received.');
    }

    res.status(200).send({ status: 'received' });
});

function verifySignature(payload: Buffer, signature: string): boolean {
    if (!SECRET) return true; // Warning: Insecure mode
    const hmac = crypto.createHmac('sha256', SECRET);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

function handlePushEvent(payload: WebhookPayload) {
    if (!payload.commits) return;

    const changedFiles = new Set<string>();

    payload.commits.forEach(commit => {
        commit.added.forEach(f => changedFiles.add(f));
        commit.modified.forEach(f => changedFiles.add(f));
    });

    const files = Array.from(changedFiles);
    if (files.length === 0) return;

    console.log(`[HEARTBEAT] ⚡ Detected changes in ${files.length} files.`);
    console.log(`[HEARTBEAT] 📜 Files: ${files.join(', ')}`);

    // Trigger Assimilation for changed files
    // In a real scenario, we would selectively parse only these files using CodeParser
    // For now, we simulate the trigger.
    triggerAnalysis(files);
}

function triggerAnalysis(files: string[]) {
    // Example: Run CodeParser on the first changed file if it's TS
    const targetFile = files.find(f => f.endsWith('.ts') || f.endsWith('.js'));
    if (targetFile) {
        const absolutePath = path.resolve(process.cwd(), targetFile);
        console.log(`[HEARTBEAT] 🧠 Triggering Analysis for: ${absolutePath}`);

        // Spawn a child process to run CodeParser (to not block the event loop)
        const parserProcess = spawn('npx', ['tsx', 'src/core/ingestion/CodeParser.ts', absolutePath], {
            stdio: 'inherit',
            shell: true
        });

        parserProcess.on('close', (code) => {
            console.log(`[HEARTBEAT] ✅ Analysis complete for ${path.basename(absolutePath)} (Exit: ${code})`);
        });
    }
}

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                              SERVER START                                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

if (process.argv[1] === import.meta.filename || process.argv[1].endsWith('WebhookListener.ts')) {
    app.listen(PORT, () => {
        console.log(`
    ╔════════════════════════════════════════════════════════════════╗
    ║             VORTEX HEARTBEAT LISTENER ONLINE                   ║
    ║                                                                ║
    ║  📡 Port: ${PORT}                                              ║
    ║  🔐 Security: HMAC-SHA256                                    ║
    ║  🧠 Mode: Active Learning                                      ║
    ╚════════════════════════════════════════════════════════════════╝
    `);
    });
}

export default app;
