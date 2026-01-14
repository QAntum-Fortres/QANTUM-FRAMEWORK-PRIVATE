/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                      THE SYNAPSE: KNOWLEDGE GRAPH v1.0                       ║
 * ║              Embeddable Graph Database for Code Relationships                ║
 * ║                       Powered by KùzuDB (Native)                             ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Maps the relationships between files, classes, and functions to answer:
 * "If I change this, what breaks?"
 */

import kuzu from 'kuzu';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

export class GraphStore {
    private db: kuzu.Database;
    private conn: kuzu.Connection;
    private dbPath: string;

    constructor(storagePath?: string) {
        this.dbPath = storagePath || path.resolve(process.cwd(), 'data/vortex-graph');

        // Ensure data directory exists
        if (!fs.existsSync(this.dbPath)) {
            fs.mkdirSync(this.dbPath, { recursive: true });
        }

        try {
            console.log(`[SYNAPSE] 🧠 Initializing KùzuDB at ${this.dbPath}...`);
            this.db = new kuzu.Database(this.dbPath);
            this.conn = new kuzu.Connection(this.db);
            this.initializeSchema();
        } catch (error) {
            console.error('[SYNAPSE] ❌ FATAL ERROR: Could not initialize KùzuDB.', error);
            throw error;
        }
    }

    private async initializeSchema() {
        try {
            // Create Node Types
            await this.conn.query(`CREATE NODE TABLE IF NOT EXISTS File (path STRING, name STRING, PRIMARY KEY(path))`);
            await this.conn.query(`CREATE NODE TABLE IF NOT EXISTS Class (id STRING, name STRING, signature STRING, PRIMARY KEY(id))`);
            await this.conn.query(`CREATE NODE TABLE IF NOT EXISTS Function (id STRING, name STRING, signature STRING, PRIMARY KEY(id))`);

            // Create Rel Types
            await this.conn.query(`CREATE REL TABLE IF NOT EXISTS IMPORTS (FROM File TO File)`);
            await this.conn.query(`CREATE REL TABLE IF NOT EXISTS DEFINES (FROM File TO Class)`);
            await this.conn.query(`CREATE REL TABLE IF NOT EXISTS DEFINES (FROM File TO Function)`);
            await this.conn.query(`CREATE REL TABLE IF NOT EXISTS CALLS (FROM Function TO Function)`); // Future: Call graph

            console.log('[SYNAPSE] 🕸️ Graph Schema Verified.');
        } catch (e) {
            // Ignore "already exists" errors roughly
            if (!(e as Error).message.includes('exists')) {
                console.error('[SYNAPSE] Schema Init Error:', e);
            }
        }
    }

    public async addFile(filePath: string) {
        const name = path.basename(filePath);
        await this.conn.query(`MERGE (f:File {path: $path, name: $name})`, { path: filePath, name });
    }

    public async addClass(fileId: string, classData: { id: string, name: string, signature: string }) {
        await this.conn.query(`MERGE (c:Class {id: $id, name: $name, signature: $sig})`,
            { id: classData.id, name: classData.name, sig: classData.signature });

        await this.conn.query(`MATCH (f:File {path: $fileId}), (c:Class {id: $classId}) MERGE (f)-[:DEFINES]->(c)`,
            { fileId, classId: classData.id });
    }

    public async getDependents(filePath: string): Promise<any[]> {
        // Determine which files import this file
        // Note: Kuzu MERGE syntax is great but for now let's just do a basic match
        const result = await this.conn.query(
            `MATCH (a:File)-[:IMPORTS]->(b:File {path: $path}) RETURN a.path`,
            { path: filePath }
        );
        return result.getAll();
    }
}

// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║                              TEST HARNESS                                    ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    (async () => {
        try {
            const graph = new GraphStore();
            console.log('[TEST] Adding file node...');
            await graph.addFile('src/core/sys/VortexAI.ts');
            console.log('[TEST] Done.');
        } catch (e) {
            console.error('[TEST] Failed:', e);
        }
    })();
}
