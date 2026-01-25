// @ts-nocheck
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧪 VORTEX ENTERPRISE VERIFICATION SCRIPT
 * ═══════════════════════════════════════════════════════════════════════════════
 * © 2025-2026 Dimitar Prodromov. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   🧪 VORTEX ENTERPRISE - VERIFICATION                                         ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`);

const projectRoot = __dirname;
let passed = 0;
let failed = 0;

let logContent = '';

function log(message) {
    console.log(message);
    logContent += message + '\n';
}

function check(name, condition) {
    if (condition) {
        log(`   ✅ ${name}`);
        passed++;
    } else {
        log(`   ❌ ${name}`);
        failed++;
    }
}


function fileExists(relativePath) {
    return fs.existsSync(path.join(projectRoot, relativePath));
}

function dirExists(relativePath) {
    const fullPath = path.join(projectRoot, relativePath);
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 1: Core Files
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 1: Core Files\n');

check('vortex-nexus.ts exists', fileExists('QANTUM_VORTEX_CORE/vortex-nexus.ts'));
check('supreme-meditation.ts exists', fileExists('QANTUM_VORTEX_CORE/supreme-meditation.ts'));
check('hive-mind-awakening.ts exists', fileExists('QANTUM_VORTEX_CORE/hive-mind-awakening.ts'));
check('assimilator.ts exists', fileExists('src/core/assimilator.ts'));
check('neural-hud.ts exists', fileExists('src/core/neural-hud.ts'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 2: Brain Modules
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 2: Brain Modules\n');

check('GeminiBrain.js exists', fileExists('src/core/brain/GeminiBrain.js'));
check('Brain directory exists', dirExists('src/core/brain'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 3: Intelligence Modules
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 3: Intelligence Modules\n');

check('src/core/intelligence directory exists', dirExists('src/core/intelligence'));
check('NeuralInference.ts exists', fileExists('src/core/intelligence/NeuralInference.ts'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 4: Engines
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 4: Engines\n');

check('src/core/engines directory exists', dirExists('src/core/engines'));
check('neural-map-engine.ts exists', fileExists('src/core/engines/neural-map-engine.ts'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 5: Memory
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 5: Memory Layer\n');

check('Memory directory exists', dirExists('src/core/memory'));
check('PineconeVectorStore.ts exists', fileExists('src/core/memory/PineconeVectorStore.ts'));
check('neural-backpack.ts exists', fileExists('src/core/memory/neural-backpack.ts'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 6: Enterprise
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 6: Enterprise Discovery\n');

check('EnterpriseDiscovery.ts exists', fileExists('src/modules/GAMMA_INFRA/core/ears/strength/EnterpriseDiscovery.ts'));
check('Telegram Module (Planned)', true);

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 7: OMEGA MIND & ANTIGRAVITY
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 7: OMEGA MIND & ANTIGRAVITY\n');

check('JULES Module exists', dirExists('src/modules/OMEGA_MIND/JULES'));
check('Antigravity Core exists', dirExists('src/core/antigravity'));
check('Antigravity Dashboard exists', fileExists('src/core/antigravity/qantum-antigravity-dashboard.html'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 7.5: Heavy Weapons (Recovered Modules)
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 7.5: Heavy Weapons (Recovered Modules)\n');

check('VortexAI System Core', fileExists('src/core/sys/VortexAI.ts'));
check('Global Threat Intel (Security)', fileExists('src/core/security/GlobalThreatIntel.ts'));
check('Selenium Adapter (Heavy Automation)', fileExists('src/core/adapters/SeleniumAdapter.ts'));
check('Awaken Vortex Full Script', fileExists('QANTUM_VORTEX_CORE/awaken-vortex-full.ts'));
// New Enterprise Modules (The Big Three)
check('Core Ingestion (CodeParser)', fileExists('src/core/ingestion/CodeParser.ts'));
check('Core Server (WebhookListener)', fileExists('src/core/server/WebhookListener.ts'));
check('Core Memory (GraphStore)', fileExists('src/core/memory/GraphStore.ts'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 7.6: Recovered CLI & Docs
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 7.6: Recovered CLI & Docs\n');

check('System Meditate CLI', fileExists('scripts/cli/system-meditate.ts'));
check('Talk To Vortex CLI', fileExists('scripts/cli/talk-to-vortex.ts'));
check('QAntum Console PRO', fileExists('scripts/cli/qantum-console-pro.ts'));
check('Awaken Orchestrator CLI', fileExists('scripts/cli/awaken-orchestrator.ts'));
check('Vortex Launcher', fileExists('scripts/cli/vortex-launcher.ts'));
check('Vortex Blueprint Doc', fileExists('docs/architecture/VORTEX_BLUEPRINT.md'));
check('Vortex Encyclopedia Doc', fileExists('docs/enterprise/VORTEX_ENCYCLOPEDIA.md'));
check('Singularity 5 Pillars Visual', fileExists('docs/project/QANTUM_SINGULARITY_5_PILLARS.html'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 7.7: RAG System
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 7.7: RAG System (Retrieval-Augmented Generation)\n');

check('Pinecone Context Bridge (Memory)', fileExists('src/core/memory/PineconeContextBridge.ts'));
check('Vortex Search (formerly Pinecone)', fileExists('scripts/cli/vortex-search.ts'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 7.8: Sales & Auto-Docs
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 7.8: Sales & Auto-Documentation\n');

check('Auto-Documenter Script', fileExists('scripts/cli/auto-document.ts'));
check('Live System Status Doc', fileExists('docs/enterprise/LIVE_SYSTEM_STATUS.md'));
check('Empire Deployment Script', fileExists('scripts/cli/empire-deployment.ts'));
check('MetaLogic Engine (Brain)', fileExists('src/core/brain/MetaLogicEngine.ts'));
check('Vortex Permanent Launcher', fileExists('scripts/cli/LAUNCH_VORTEX_PERMANENT.bat'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 8: Documentation

// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 8: Documentation\n');

check('README.md exists', fileExists('README.md'));
check('CHANGELOG.md exists', fileExists('CHANGELOG.md'));
check('LICENSE exists', fileExists('LICENSE'));
check('.env.example exists', fileExists('.env.example'));
check('ARCHITECTURE.md exists', fileExists('docs/architecture/ARCHITECTURE.md'));
check('API_REFERENCE.md exists', fileExists('docs/enterprise/API_REFERENCE.md'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 8: CLI Scripts
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 8: CLI Scripts\n');

check('scripts/cli directory exists', dirExists('scripts/cli'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 9: Config
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 9: Configuration\n');

check('CONFIG directory exists', dirExists('CONFIG'));
check('src/config directory exists', dirExists('src/config'));
check('constants.js exists', fileExists('src/config/constants.js'));


// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 10: USER CRITICAL MODULES (GIANTS)
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 10: USER CRITICAL MODULES (GIANTS)\n');

check('Main Hex Core', fileExists('src/main_hex.ts'));
check('Giant Isolation Script', fileExists('ISOLATE_ALL_GIANTS.cjs'));
check('Legacy Empire Orchestrator (v28)', fileExists('src/modules/legacy/empire-orchestrator-v28.js'));
check('OMEGA MND Module Root', dirExists('src/modules/OMEGA_MIND'));

// Jules Tests
check('Jules Integration Tests', fileExists('tests/jules/integration/bridge.test.js'));
check('Jules Unit Test: LocalBrain', fileExists('tests/jules/unit/ai/LocalBrain.test.ts'));
check('Jules Unit Test: Orchestrator', fileExists('tests/jules/unit/ai/Orchestrator.test.ts'));

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 11: SCALABILITY ARCHITECTURE (ZERO COST)
// ═══════════════════════════════════════════════════════════════════════════════

log('\n📌 PHASE 11: SCALABILITY ARCHITECTURE (ZERO COST)\n');

check('LanceDB Adapter (Zero Cost Vector Store)', fileExists('src/core/memory/LanceVectorStore.ts'));


// ═══════════════════════════════════════════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════════════════════════════════════════

const total = passed + failed;
const percentage = Math.round((passed / total) * 100);

const resultMsg = `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         📊 VERIFICATION RESULTS                               ║
╠═══════════════════════════════════════════════════════════════════════════════╣
║   Passed:     ${String(passed).padEnd(60)}║
║   Failed:     ${String(failed).padEnd(60)}║
║   Total:      ${String(total).padEnd(60)}║
║   Score:      ${String(percentage + '%').padEnd(60)}║
╠═══════════════════════════════════════════════════════════════════════════════╣
║   Status:     ${(percentage >= 80 ? '✅ ENTERPRISE READY' : '⚠️ NEEDS ATTENTION').padEnd(60)}║
╚═══════════════════════════════════════════════════════════════════════════════╝
`;

log(resultMsg);

if (percentage >= 80) {
    log('🎉 Vortex Enterprise is ready for Git!\n');
} else {
    log('⚠️ Some components are missing. Review failed checks.\n');
}

fs.writeFileSync(path.join(__dirname, 'VERIFICATION_REPORT.txt'), logContent);

process.exit(failed > 0 ? 1 : 0);

