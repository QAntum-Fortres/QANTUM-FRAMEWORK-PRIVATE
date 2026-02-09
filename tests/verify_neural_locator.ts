import { VeritasBridge } from '../src/veritas_sdk/Bridge.ts';
import { AutonomousAgent } from '../src/veritas_sdk/Agent.ts';
import type { GoalResult, VisionResult, ObserverState } from '../src/veritas_sdk/types.ts';

async function runVerification() {
    console.log("---------------------------------------------------");
    console.log("VERITAS FRAMEWORK VERIFICATION (Neural Locator & Agent)");
    console.log("---------------------------------------------------");

    const bridge = new VeritasBridge();

    // Give core a moment to spawn
    await new Promise(r => setTimeout(r, 1000));

    try {
        // 1. Verify Neural Locator (Vision)
        console.log("\n[TEST] Verifying Neural Locator...");
        const mockScreenshot = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
        const visionResult: VisionResult = await bridge.locate(mockScreenshot, "Find Checkout Button");

        if (visionResult.found && visionResult.location) {
            console.log("✅ Neural Locator successfully identified target.");
            console.log(`   Location: [${visionResult.location.x}, ${visionResult.location.y}]`);
            console.log(`   Confidence: ${(visionResult.confidence * 100).toFixed(2)}%`);
            console.log(`   Reasoning: ${visionResult.reasoning}`);
        } else {
            console.error("❌ Neural Locator failed to identify target.");
            process.exit(1);
        }

        // 2. Verify Goal Planner (Agent Logic via Bridge)
        console.log("\n[TEST] Verifying Goal Planner (Bridge Layer)...");
        const goalResult: GoalResult = await bridge.planGoal(
            "Verify purchase with discount",
            [],
            "User is on the homepage."
        );

        if (goalResult.next_step) {
            console.log("✅ Goal Planner successfully generated next step.");
            console.log(`   Action: ${goalResult.next_step.action}`);
            console.log(`   Reasoning: ${goalResult.next_step.reasoning}`);
        } else {
            console.error("❌ Goal Planner failed to generate a step.");
            process.exit(1);
        }

        // 3. Verify State Observer (Zero-Wait)
        console.log("\n[TEST] Verifying State Observer...");
        const observerState: ObserverState = await bridge.observeState({
            url: "http://localhost:3000",
            layout_shifts: 0,
            network_pending: 0,
            dom_mutations: 0,
            last_interaction_ms: 5000
        });

        if (observerState.stable) {
            console.log("✅ State Observer confirmed stability.");
            console.log(`   Score: ${observerState.amniotic_state_score}`);
            console.log(`   Recommendation: ${observerState.recommendation}`);
        } else {
            console.error("❌ State Observer reported instability unexpectedly.");
            process.exit(1);
        }

    } catch (error) {
        console.error("❌ Verification Failed (Bridge Level):", error);
        process.exit(1);
    } finally {
        bridge.kill();
    }

    // 4. Verify AutonomousAgent Class
    console.log("\n[TEST] Verifying AutonomousAgent Class Integration...");
    const agent = new AutonomousAgent("Test-Agent-007");
    try {
        // Run a short goal
        await agent.executeGoal("Quick sanity check");
        console.log("✅ AutonomousAgent execution completed without error.");
    } catch (e) {
        console.error("❌ AutonomousAgent Failed:", e);
        process.exit(1);
    } finally {
        agent.shutdown();
    }

    console.log("\n---------------------------------------------------");
    console.log("VERIFICATION COMPLETE");
    process.exit(0);
}

runVerification();
