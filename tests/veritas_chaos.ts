import { VeritasBridge } from '../src/veritas_sdk/Bridge.ts';

// INTEGRATION TEST: SELF-HEALING UNDER FIRE
// Scenario: Sovereign Tier resilience test.

async function runChaosTest() {
    console.log("---------------------------------------------------");
    console.log("TEST: VERITAS SOVEREIGN RESILIENCE (CHAOS)");
    console.log("---------------------------------------------------");

    const bridge = new VeritasBridge();

    // Give core time to spawn and pre-warm (50 agents)
    await new Promise(r => setTimeout(r, 2000));

    console.log("1. Initializing Sovereign Request...");
    // Simulate a normal request
    try {
        const res = await bridge.locate("base64_img", "Sovereign Search");
        console.log(`[PASS] Initial Request OK (Conf: ${res.confidence})`);
    } catch(e) {
        console.error(`[FAIL] Initial Request: ${e}`);
    }

    console.log("2. TRIGGERING CHAOS (Killing 45 Agents)...");
    // This drops pool to 5 (Threshold is 20) -> Should trigger Replenish back to 50
    try {
        const res = await (bridge as any).sendCommand('Chaos', { kill_count: 45 });
        console.log(`[CHAOS] Report: ${res}`);
        if (res.includes("replenished")) {
            console.log(`[PASS] Progressive Warming Triggered.`);
        } else {
            console.error(`[FAIL] Progressive Warming NOT Triggered.`);
        }
    } catch (e) {
        console.error(`[FAIL] Chaos Command: ${e}`);
    }

    console.log("3. Verifying Post-Chaos Stability...");
    // Immediate follow-up request should still work if replenishment was instant/fast
    try {
        const res = await bridge.locate("base64_img", "Post-Chaos Verification");
        if (res.found) {
            console.log(`[PASS] System maintained availability.`);
        }
    } catch(e) {
        console.error(`[FAIL] System unavailable after Chaos: ${e}`);
    }

    bridge.kill();
}

runChaosTest().catch(console.error);
