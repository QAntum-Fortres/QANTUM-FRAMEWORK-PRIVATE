import { AutonomousAgent } from '../src/veritas_sdk/Agent.js';

async function main() {
    console.log("🚀 Starting Veritas Integration Test...");

    const agent = new AutonomousAgent("Test-Agent-Alpha");

    try {
        await agent.executeGoal({
            description: "Verify discount application on checkout"
        });
        console.log("✅ Goal execution completed successfully.");
    } catch (error) {
        console.error("❌ Goal execution failed:", error);
        process.exit(1);
    } finally {
        agent.shutdown();
        console.log("🛑 Agent shutdown.");
    }
}

main();
