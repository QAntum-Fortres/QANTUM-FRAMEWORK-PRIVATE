
import * as fs from 'fs';
import * as path from 'path';

const TARGET_DIR = 'QANTUM_CORE_15M';
const SEARCH_TARGETS = [
    'GAMMA_INFRA',
    'DELTA_SCIENCE',
    'OMEGA_MIND',
    'VI_BIOLOGY',
    'ALPHA_FINANCE',
    'BETA_SECURITY',
    'QANTUM_GHOSTSHIELD',
    'VORTEX_CORE',
    'INTELLIGENCE',
    'QANTUM_UNIFIED_PROJECT',
    'QANTUM_STAR',
    'QANTUM_SAAS',
    'QANTUM_PRIME_WEB',
    'QANTUM_NEXUS',
    'SCRIPTS', // The Massive Script Arsenal
    'MisteMind' // The Brain
];

const IGNORE_DIRS = new Set([
    'node_modules', '.git', 'dist', 'build', '.gemini',
    TARGET_DIR, 'out', 'coverage', '.vscode', '.idea'
]);

function scanAndMove(rootDir: string) {
    if (!fs.existsSync(TARGET_DIR)) {
        console.log(`[SETUP] Creating ${TARGET_DIR}...`);
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    const MAX_DEPTH = 5;

    function walk(dir: string, depth: number) {
        if (depth > MAX_DEPTH) return;

        try {
            const items = fs.readdirSync(dir, { withFileTypes: true });

            for (const item of items) {
                const fullPath = path.join(dir, item.name);

                if (item.isDirectory()) {
                    if (IGNORE_DIRS.has(item.name)) continue;

                    // CHECK FOUND
                    if (SEARCH_TARGETS.includes(item.name)) {
                        console.log(`🎯 FOUND: ${fullPath}`);
                        moveDirectory(fullPath, item.name);
                        continue; // Moved, so don't recurse
                    }

                    // RECURSE
                    walk(fullPath, depth + 1);
                }
            }
        } catch (e: any) {
            // Ignore permission errors etc.
        }
    }

    function moveDirectory(source: string, name: string) {
        // Construct destination in QANTUM_CORE_15M/NAME (e.g. QANTUM_CORE_15M/GAMMA_INFRA)
        let dest = path.join(TARGET_DIR, name);

        // If exact destination exists, maybe merge? 
        // User said "Gather in one folder". 
        // If we found duplicates, rename them to check content later?
        if (fs.existsSync(dest)) {
            let count = 2;
            while (fs.existsSync(`${dest}_v${count}`)) { count++; }
            dest = `${dest}_v${count}`;
            console.log(`⚠️ Conflict. Renaming to ${dest}`);
        }

        try {
            console.log(`🚚 Moving...`);
            fs.renameSync(source, dest);
            console.log(`✅ Moved: ${source} -> ${dest}`);
        } catch (e: any) {
            console.error(`❌ Rename failed: ${e.message}. Trying Copy-Delete.`);
            try {
                fs.cpSync(source, dest, { recursive: true });
                fs.rmSync(source, { recursive: true, force: true });
                console.log(`✅ Copy-Delete Success.`);
            } catch (e2: any) {
                console.error(`❌ FATAL: Failed to move ${source}`);
            }
        }
    }

    console.log('🚀 Starting Depth-Limited Scan (Max 5)...');
    walk(rootDir, 0);
    console.log('🏁 Scan Complete.');
}

scanAndMove('.');
