import { GoalOrientedAgent } from '../src';

async function main() {
    const agent = new GoalOrientedAgent();

    console.log("--- Starting Veritas Agent ---");
    await agent.executeGoal("Verify that a user can complete a purchase with a 10% discount code.");
    console.log("--- Agent Execution Complete ---");
}

main().catch(console.error);
