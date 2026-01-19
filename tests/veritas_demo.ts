import { AutonomousAgent } from '../src/veritas_sdk/Agent.ts';

async function runDemo() {
    console.log("---------------------------------------------------");
    console.log("VERITAS COGNITIVE QA FRAMEWORK - LIVE DEMONSTRATION");
    console.log("---------------------------------------------------");

    const agent = new AutonomousAgent("VERITAS-DEMO-UNIT");

    // Scenario 1: Discount Purchase
    console.log("\n>>> SCENARIO 1: Full Purchase Flow with Discount");
    await agent.executeGoal({
        description: "Verify that a user can complete a purchase with a 10% discount code."
    });

    // Scenario 2: Login Flow
    console.log("\n>>> SCENARIO 2: Authentication Check");
    await agent.executeGoal({
        description: "Login with user 'admin' and verify dashboard access."
    });

    agent.shutdown();
}

runDemo().catch(console.error);
