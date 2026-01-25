// lwas_core/src/bin/telemetry_reporter.rs
// IDENTITY: SOVEREIGN_TELEMETRY_BRIDGE
// AUTHORITY: AETERNA

use lwas_core::telemetry::TelemetryHub;

fn main() {
    let mut hub = TelemetryHub::new();
    // Single capture and print to stdout for easy pipe to Python/JS
    println!("{}", hub.capture_json());
}
