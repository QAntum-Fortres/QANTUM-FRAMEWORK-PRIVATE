import { chromium } from 'playwright';
import { AutonomousAgent } from '../src/veritas_sdk/Agent.ts';
import * as path from 'path';

async function runProductionTest() {
    console.log("---------------------------------------------------");
    console.log("VERITAS ENTERPRISE PRODUCTION VERIFICATION");
    console.log("---------------------------------------------------");

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Use the Enterprise Dashboard as the target for this production test
    const dashboardPath = path.resolve(process.cwd(), 'docs/enterprise-dashboard.html');
    await page.goto(`file://${dashboardPath}`);
    console.log(`[SETUP] Navigated to: ${dashboardPath}`);

    const agent = new AutonomousAgent("PROD-VERIFIER-01");
    agent.setPage(page);

    // Scenario 1: High Confidence Flow (Should find 'Run Compliance Audit' button equivalent)
    // Note: The agent is simulated, but it will take REAL screenshots now.
    console.log("\n>>> SCENARIO 1: Real Vision & Interaction");
    await agent.executeGoal({
        description: "Run Compliance Audit via Dashboard"
    });

    // Scenario 2: Fail-Safe Trigger (Simulated by asking for something obscure)
    // The core simulation randomly assigns confidence, but if we ask for something weird,
    // the core logic (random) might yield low confidence or we can rely on random chance
    // in the simulation to trigger the warning logic we added.
    console.log("\n>>> SCENARIO 2: Edge Case Handling");
    await agent.executeGoal({
        description: "Find the hidden flux capacitor settings"
    });

    await browser.close();
    agent.shutdown();
}

runProductionTest().catch(console.error);
