const fs = require('fs');
const path = require('path');

// List of all package.json locations found earlier
const CANDIDATES = [
    'CONFIG',
    'MisteMind/PRODUCTS/ghostshield-sdk',
    'MisteMind/PRODUCTS/qantum-debugger',
    'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/Mind-Engine-Core',
    'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/PROJECT/PRIVATE/MrMindQATool',
    'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/PROJECT/PRIVATE/QA-Framework',
    'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/PROJECT/PUBLIC/QAntum-Demo',
    'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/PROJECT/QA-SAAS',
    'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/PROJECT/QANTUM-NEXUS',
    'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/QAntum-Empire-1M-CODE-2026-01-02/MisteMind.-star',
    'src/BETA_SECURITY/security_core/MrMindQATool_ACTIVE/webapp',
    'src/BETA_SECURITY/security_core/ASCENSION_KERNEL',
    'src/GAMMA_INFRA',
    'QANTUM_UNIFIED_PROJECT'
];

function countFiles(dir) {
    let count = 0;
    if (!fs.existsSync(dir)) return 0;
    try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            if (item === 'node_modules' || item === '.git') continue;
            const fullPath = path.join(dir, item);
            try {
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    count += countFiles(fullPath);
                } else {
                    count++;
                }
            } catch (e) { }
        }
    } catch (e) { }
    return count;
}

console.log('🔍 DEEP SCANNING PROJECT SIZES (skipping node_modules)...\n');

const results = [];
for (const cand of CANDIDATES) {
    const fullPath = path.join(__dirname, cand);
    const count = countFiles(fullPath);
    results.push({ path: cand, count: count });
}

// Sort by count descending
results.sort((a, b) => b.count - a.count);

console.log('📊 PROJECT RANKING BY FILE COUNT:\n');
results.forEach(r => {
    let label = r.count > 1000 ? '🔥 MASSIVE' : r.count > 100 ? '📦 BIG' : '📄 SMALL';
    console.log(`${r.count.toString().padStart(6)} files | ${label.padEnd(10)} | ${r.path}`);
});
