import { VeritasBridge } from '../src/veritas_sdk/Bridge.ts';

// CHAOS MONKEY (The Apoptosis Protocol)
// Randomly terminates agents to test the Sovereign Tier's resilience.

async function initiateChaos() {
    console.log("---------------------------------------------------");
    console.log("PROTOCOL: APOPTOSIS (CHAOS MONKEY)");
    console.log("TARGET: Veritas Sovereign WarmPool");
    console.log("---------------------------------------------------");

    // We can use the Bridge to send commands directly to the core process
    // This assumes the script spawns its own core instance for the test.
    // In a real environment, this would connect to the running service via gRPC.
    const bridge = new VeritasBridge();

    // Wait for core spin up
    await new Promise(r => setTimeout(r, 2000));

    console.log("[CHAOS] Initializing Attack Vector...");

    // Attack 1: Minor Disruption (Kill 5 agents)
    console.log("[CHAOS] Executing: Minor Disruption (Kill 5 Agents)...");
    try {
        const res = await (bridge as any).sendCommand('Chaos', { kill_count: 5 });
        console.log(`[CHAOS] Result: ${res}`);
    } catch (e) {
        console.error(`[CHAOS] Failed: ${e}`);
    }

    // Attack 2: Major Event (Kill 40 agents - Should trigger Replenishment)
    console.log("[CHAOS] Executing: Major Event (Kill 40 Agents)...");
    try {
        const res = await (bridge as any).sendCommand('Chaos', { kill_count: 40 });
        console.log(`[CHAOS] Result: ${res}`);
    } catch (e) {
        console.error(`[CHAOS] Failed: ${e}`);
    }

    // Cleanup
    bridge.kill();
    console.log("[CHAOS] Protocol Complete. Resilience Verified if Replenishment > 0.");
}

initiateChaos().catch(console.error);
