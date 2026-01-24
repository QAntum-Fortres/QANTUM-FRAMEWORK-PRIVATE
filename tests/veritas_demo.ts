import { VeritasClient } from '../veritas-sdk/src/index.ts';
import * as path from 'path';

async function runDemo() {
    console.log("---------------------------------------------------");
    console.log("   VERITAS COGNITIVE QA FRAMEWORK - DEMO PROTOCOL");
    console.log("---------------------------------------------------");

    // Point to the compiled binary
    const corePath = path.resolve(process.cwd(), 'veritas_core/target/debug/veritas_core');

    const veritas = new VeritasClient({ corePath });

    try {
        await veritas.start();

        // 1. Test Vision-Based Locator
        console.log("\n[TEST 1] Vision-Transformer Neural Locator");
        console.log("Requesting: 'Find the Buy Now button'...");
        const locResult = await veritas.visual.locate("Find the Buy Now button");
        if (locResult.status === 'success' && locResult.data.found) {
            console.log("✅ SUCCESS: Element found at", locResult.data.location);
            console.log("   Confidence:", locResult.data.confidence);
            console.log("   Reasoning:", locResult.data.reasoning);
        } else {
            console.error("❌ FAILED: Locator did not return success.");
        }

        // 2. Test Goal-Oriented Agent
        console.log("\n[TEST 2] Goal-Oriented Autonomous Agent");
        const goal = "Verify that a user can purchase the 'Quantum Widget' with a 10% discount.";
        console.log(`Goal: "${goal}"`);
        const agentResult = await veritas.agent.goal(goal);

        if (agentResult.status === 'success' && agentResult.data.success) {
            console.log("✅ SUCCESS: Agent achieved goal.");
            console.log("   Steps taken:", agentResult.data.steps.length);
            agentResult.data.steps.forEach((step: any, i: number) => {
                console.log(`   ${i+1}. [${step.action}] -> ${step.observation}`);
            });
            console.log("   Audit Log:", agentResult.data.audit_log_url);
        } else {
            console.error("❌ FAILED: Agent failed to achieve goal.");
        }

        // 3. Test Distributed Swarm
        console.log("\n[TEST 3] Distributed Swarm Execution");
        console.log("Launching 1000 micro-agents across 3 regions...");
        const swarmResult = await veritas.swarm.launch(1000, ["us-east-1", "eu-central-1", "ap-northeast-1"]);

        if (swarmResult.status === 'success') {
            console.log("✅ SUCCESS: Swarm Active.");
            console.log("   Active Agents:", swarmResult.data.active_agents);
            console.log("   Throughput:", swarmResult.data.throughput_tps.toFixed(2), "TPS");
        } else {
             console.error("❌ FAILED: Swarm launch failed.");
        }

    } catch (error) {
        console.error("CRITICAL FAILURE:", error);
    } finally {
        await veritas.stop();
    }
}

runDemo();
