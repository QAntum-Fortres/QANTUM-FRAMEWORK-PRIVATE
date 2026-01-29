import * as fs from 'fs';
import * as path from 'path';

// Layer 6: GOVERNANCE - Infrastructure Drift Guard
// Checks the 'Source of Truth' (Docker Compose) against the 'Live Reality' (Simulated State)

const SOURCE_OF_TRUTH = path.resolve(process.cwd(), 'docker-compose.fullstack.yml');
const MOCK_INFRA_STATE = path.resolve(process.cwd(), 'scripts/mock_infra_state.json');

// Mock live state if not present (Simulation of querying AWS/Azure API)
if (!fs.existsSync(MOCK_INFRA_STATE)) {
    fs.writeFileSync(MOCK_INFRA_STATE, JSON.stringify({
        "services": {
            "nerve-center": { "replicas": 1, "image": "veritas/nerve-center:v37" },
            "veritas-core": { "replicas": 1, "image": "veritas/core:v2-omega" },
            "postgres": { "volume_size_gb": 100 }
        },
        "last_updated": new Date().toISOString()
    }, null, 2));
}

function detectDrift() {
    console.log("---------------------------------------------------");
    console.log("LAYER 6: GOVERNANCE - INFRASTRUCTURE DRIFT GUARD");
    console.log("---------------------------------------------------");

    if (!fs.existsSync(SOURCE_OF_TRUTH)) {
        console.error("[CRITICAL] Source of Truth (docker-compose.fullstack.yml) not found!");
        process.exit(1);
    }

    const truthRaw = fs.readFileSync(SOURCE_OF_TRUTH, 'utf-8');
    const stateRaw = fs.readFileSync(MOCK_INFRA_STATE, 'utf-8');
    const state = JSON.parse(stateRaw);

    let driftDetected = false;

    // 1. Check Service Existence Drift
    const servicesToCheck = ["nerve-center", "veritas-core", "postgres"];

    // Simulate parsing Docker Compose (regex for demo simplicity)
    servicesToCheck.forEach(svc => {
        // Assume services are defined as "  service_name:"
        // This is a heuristic check for the demo script
        // In prod, use a YAML parser.
        const serviceInTruth = truthRaw.includes(`${svc}:`);
        const serviceInState = !!state.services[svc];

        if (serviceInTruth && !serviceInState) {
            console.error(`[DRIFT] Service '${svc}' defined in code but missing in live infra.`);
            driftDetected = true;
        }
    });

    // 2. Check Configuration Drift (Simulated)
    // Let's pretend someone manually changed the 'replicas' in AWS (State) vs Code
    // We simulate this by checking a hypothetical "replicas" comment in compose vs state

    if (state.services["veritas-core"].replicas > 5) {
         console.error(`[DRIFT] 'veritas-core' running ${state.services["veritas-core"].replicas} replicas (Manual Scale-Up Detected). Config allows max 5.`);
         driftDetected = true;
    }

    if (driftDetected) {
        console.error("\n[GOVERNANCE] DRIFT DETECTED! INITIATING ROLLBACK PROTOCOL...");
        // In real life: exec('terraform apply -auto-approve')
        console.log(">> [ACTION] Re-applying configuration from docker-compose.fullstack.yml...");
        console.log(">> [SUCCESS] Infrastructure aligned with Code.");
    } else {
        console.log("[GOVERNANCE] System is Sovereign. No drift detected.");
    }
}

detectDrift();
