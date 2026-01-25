// lwas_core/src/telemetry.rs
// IDENTITY: SOVEREIGN_TELEMETRY
// AUTHORITY: AETERNA

use serde::Serialize;
use sysinfo::System;

#[derive(Serialize, Clone, Debug)]
pub struct SystemStats {
    pub cpu_usage: f32,
    pub ram_used_gb: f32,
    pub ram_total_gb: f32,
    pub uptime_secs: u64,
    pub entropy: f64,
}

pub struct TelemetryHub {
    sys: System,
}

impl TelemetryHub {
    pub fn new() -> Self {
        let mut sys = System::new_all();
        sys.refresh_all();
        Self { sys }
    }

    pub fn capture(&mut self) -> SystemStats {
        self.sys.refresh_cpu();
        self.sys.refresh_memory();

        // In sysinfo 0.30+, methods are inherent to the struct
        let cpu_usage = self.sys.global_cpu_info().cpu_usage();
        let ram_used = self.sys.used_memory() as f32 / 1024.0 / 1024.0 / 1024.0;
        let ram_total = self.sys.total_memory() as f32 / 1024.0 / 1024.0 / 1024.0;
        let uptime = System::uptime();

        let global_entropy = crate::omega::global_assimilation::GLOBAL_ENTROPY
            .load(std::sync::atomic::Ordering::SeqCst) as f64
            / 1000.0;

        SystemStats {
            cpu_usage,
            ram_used_gb: ram_used,
            ram_total_gb: ram_total,
            uptime_secs: uptime,
            entropy: global_entropy,
        }
    }

    pub fn capture_json(&mut self) -> String {
        let stats = self.capture();
        serde_json::to_string(&stats).unwrap_or_else(|_| "{}".to_string())
    }
}
