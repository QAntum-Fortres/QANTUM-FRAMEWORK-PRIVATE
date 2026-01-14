const fs = require('fs');
const path = require('path');

const ISOLATION_TARGETS = [
    { src: 'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/Mind-Engine-Core', target: 'QANTUM_MIND_ENGINE' },
    { src: 'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/PROJECT/QA-SAAS', target: 'QANTUM_SAAS' },
    { src: 'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/PROJECT/PRIVATE/QA-Framework', target: 'QANTUM_FRAMEWORK' },
    { src: 'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/PROJECT/PUBLIC/QAntum-Demo', target: 'QANTUM_DEMO' },
    { src: 'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/PROJECT/QANTUM-NEXUS', target: 'QANTUM_NEXUS' },
    { src: 'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/PROJECT/PRIVATE/MrMindQATool', target: 'QANTUM_MR_MIND_TOOL' },
    { src: 'SCRIPTS/original_scripts/1_STRENGTH/_ARCHIVE/QAntum-Empire-1M-CODE-2026-01-02/MisteMind.-star', target: 'QANTUM_STAR' },
    { src: 'CONFIG', target: 'QANTUM_CONFIG_HUB' }
];

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) {
        console.log(`❌ Source not found: ${from}`);
        return;
    }
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });

    fs.readdirSync(from).forEach(element => {
        if (element === '.git') return; // Keep node_modules for 'Brutal' projects if user wants them, but usually we skip. Let's skip to save time/space.
        if (element === 'node_modules') return;

        const Stat = fs.lstatSync(path.join(from, element));
        const src = path.join(from, element);
        const dest = path.join(to, element);

        if (Stat.isFile()) {
            fs.copyFileSync(src, dest);
        } else if (Stat.isDirectory()) {
            copyFolderSync(src, dest);
        }
    });
}

console.log('🚀 UNLEASHING THE EMPIRE: ISOLATING 8 MAJOR PROJECTS...\n');

ISOLATION_TARGETS.forEach(proj => {
    const srcPath = path.join(__dirname, proj.src);
    const targetPath = path.join(__dirname, proj.target);

    console.log(`📦 Isolating ${proj.target}...`);
    copyFolderSync(srcPath, targetPath);
    console.log(`   ✅ ${proj.target} deployed.`);

    // Add SOVEREIGNTY MARKER
    fs.writeFileSync(path.join(targetPath, 'SOVEREIGNTY_DECLARED.md'), `# ${proj.target}\n\nEstablished: ${new Date().toISOString()}\nStatus: SOVEREIGN\nSource: ${proj.src}`);
});

console.log('\n🏁 EMPIRE EXPANSION COMPLETE.');
