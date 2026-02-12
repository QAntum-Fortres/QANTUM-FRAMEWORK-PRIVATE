import { AutonomousAgent } from '../src/veritas_sdk/Agent';

async function runDemo() {
    console.log("🚀 VERITAS V2.0 COGNITIVE QA FRAMEWORK - DEMO INITIALIZED");

    const agent = new AutonomousAgent("Sovereign-Alpha");

    try {
        console.log("\n[1] TEST: Neural Locator & Agent Planning");
        const goal = {
            description: "Verify purchase with 10% discount code 'SAVE10'"
        };

        const result = await agent.executeGoal(goal);

        if (result.success && result.steps.length > 0) {
            console.log("✅ GOAL EXECUTION SUCCESSFUL");
            console.log(`   Steps: ${result.steps.length}`);
            console.log(`   Total Duration: ${result.total_duration_ms}ms`);
            console.log(`   Audit Log: ${result.audit_log_url}`);
        } else {
            console.error("❌ GOAL EXECUTION FAILED");
            process.exit(1);
        }

    } catch (error) {
        console.error("❌ DEMO FAILED WITH EXCEPTION:", error);
        process.exit(1);
    } finally {
        agent.shutdown();
    }
}

runDemo();
