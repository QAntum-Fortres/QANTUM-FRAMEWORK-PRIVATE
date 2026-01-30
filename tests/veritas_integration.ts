import { AutonomousAgent } from '../src/veritas_sdk/Agent';

async function runIntegrationTest() {
    console.log("🚀 Starting Veritas Core Integration Test...");

    const agent = new AutonomousAgent("Test-Agent-007");

    const goal = {
        description: "Navigate to Checkout and Apply 10% Discount"
    };

    try {
        await agent.executeGoal(goal);
        console.log("✅ Integration Test Passed: Agent completed execution loop.");
    } catch (error) {
        console.error("❌ Integration Test Failed:", error);
        process.exit(1);
    } finally {
        agent.shutdown();
    }
}

runIntegrationTest();
