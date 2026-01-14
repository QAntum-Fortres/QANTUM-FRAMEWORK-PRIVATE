const fs = require('fs');
const path = require('path');

// CONFIGURATION
const SOURCE_ROOT = process.cwd();
const TARGET_DIR_NAME = 'QANTUM_UNIFIED_PROJECT';
const TARGET_DIR = path.join(SOURCE_ROOT, TARGET_DIR_NAME);

// List of critical modules that UnifiedGuardian looks for
// Based on INTELLIGENCE_MODULES in unified-guardian.js
const CRITICAL_MODULES = [
    'EcosystemSyncValidator.ts',
    'EcosystemHarmonizer.ts',
    'CrossProjectSynergy.ts',
    'SovereignAudit.ts',
    'HealthMonitor.ts',
    'VectorSync.ts',
    'SovereignMagnet.ts',
    'nucleus-mapper.js',
    'eternal-guardian.js',
    'unified-guardian.js', // The guardian itself
    'unified-guardian.cjs' // The commonjs version we made
];

// Map found files to their ideal target structure
// Unified Guardian expects:
// src/intelligence/ -> Most modules
// src/omega/ -> SovereignMagnet
// scripts/ -> nucleus-mapper, eternal-guardian
const TARGET_STRUCTURE = {
    'EcosystemSyncValidator.ts': 'src/intelligence/EcosystemSyncValidator.ts',
    'EcosystemHarmonizer.ts': 'src/intelligence/EcosystemHarmonizer.ts',
    'CrossProjectSynergy.ts': 'src/intelligence/CrossProjectSynergy.ts',
    'SovereignAudit.ts': 'src/intelligence/SovereignAudit.ts',
    'HealthMonitor.ts': 'src/intelligence/HealthMonitor.ts',
    'VectorSync.ts': 'src/intelligence/VectorSync.ts',
    'SovereignMagnet.ts': 'src/omega/SovereignMagnet.ts',
    'nucleus-mapper.js': 'scripts/nucleus-mapper.js',
    'eternal-guardian.js': 'scripts/eternal-guardian.js',
    'unified-guardian.js': 'scripts/unified-guardian.js',
    'unified-guardian.cjs': 'scripts/unified-guardian.cjs'
};

console.log('🚀 PROJECT ASSEMBLER STARTED');
console.log(`📂 Source: ${SOURCE_ROOT}`);
console.log(`🎯 Target: ${TARGET_DIR}`);

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR);
    console.log('✅ Created target directory');
}

// Helper to find file recursively
function findFile(root, filename) {
    const files = fs.readdirSync(root);
    for (const file of files) {
        if (['node_modules', '.git', TARGET_DIR_NAME].includes(file)) continue;

        const fullPath = path.join(root, file);
        let stat;
        try {
            stat = fs.statSync(fullPath);
        } catch (e) { continue; }

        if (stat.isDirectory()) {
            const result = findFile(fullPath, filename);
            if (result) return result;
        } else if (file === filename) {
            return fullPath;
        }
    }
    return null;
}

// Main assembly loop
let foundCount = 0;

for (const moduleName of CRITICAL_MODULES) {
    console.log(`🔍 Searching for ${moduleName}...`);
    const sourcePath = findFile(SOURCE_ROOT, moduleName);

    if (sourcePath) {
        const destRelPath = TARGET_STRUCTURE[moduleName] || moduleName;
        const destPath = path.join(TARGET_DIR, destRelPath);

        // Ensure dest dir exists
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ FOUND & COPIED: ${moduleName} -> ${destRelPath}`);
        foundCount++;
    } else {
        console.log(`❌ NOT FOUND: ${moduleName}`);
    }
}

// Create a README explaining this is the clean project
const readmeContent = `# QAntum Unified Project

This folder contains the assembled core of the QAntum Ecosystem, extracted and organized by the PROJECT ASSEMBLER.

## Structure
- **src/intelligence/**: Core intelligence modules (EcosystemSync, HealthMonitor, etc.)
- **src/omega/**: Omega-level modules (SovereignMagnet)
- **scripts/**: Guardian and maintenance scripts

## Usage
Run the guardian from this directory:
\`\`\`bash
node scripts/unified-guardian.cjs
\`\`\`
`;

fs.writeFileSync(path.join(TARGET_DIR, 'README.md'), readmeContent);

console.log('══════════════════════════════════');
console.log(`🎉 Assembly Complete!`);
console.log(`📦 Modules Assembled: ${foundCount}/${CRITICAL_MODULES.length}`);
console.log(`📂 Output Location: ${TARGET_DIR}`);
console.log('══════════════════════════════════');
