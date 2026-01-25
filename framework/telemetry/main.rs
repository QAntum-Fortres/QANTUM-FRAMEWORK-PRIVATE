// lwas_telemetry_reporter/src/main.rs
use serde::Serialize;
use sysinfo::System;

#[derive(Serialize, Clone, Debug)]
pub struct SystemStats {
    pub cpu_usage: f32,
    pub ram_used_gb: f32,
    pub ram_total_gb: f32,
    pub uptime_secs: u64,
    pub resonance: f32,
}

fn main() {
    let mut sys = System::new_all();
    sys.refresh_all();

    // Initial refresh to get valid CPU stats on the first pass
    std::thread::sleep(std::time::Duration::from_millis(100));
    sys.refresh_cpu_all();

    let cpu_usage = sys.global_cpu_usage();
    let ram_used = sys.used_memory() as f32 / 1024.0 / 1024.0 / 1024.0;
    let ram_total = sys.total_memory() as f32 / 1024.0 / 1024.0 / 1024.0;
    let uptime = System::uptime();

    let stats = SystemStats {
        cpu_usage,
        ram_used_gb: ram_used,
        ram_total_gb: ram_total,
        uptime_secs: uptime,
        resonance: 0.8890, // Port 8890 Reference
    };

    if let Ok(json) = serde_json::to_string(&stats) {
        println!("{}", json);
    }
}
