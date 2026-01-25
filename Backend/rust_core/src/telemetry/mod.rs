use serde::{Deserialize, Serialize};
use sysinfo::System;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemMetrics {
    pub cpu_load: f32,
    pub ram_usage_percent: f32,
    pub ram_used_gb: f32,
    pub ram_total_gb: f32,
    pub temperature_celsius: f32,
    pub active_transactions: usize,
}

pub struct TelemetryEngine {
    system: System,
}

impl TelemetryEngine {
    pub fn new() -> Self {
        Self {
            system: System::new_all(),
        }
    }

    pub fn get_metrics(&mut self, transaction_count: usize) -> SystemMetrics {
        // Refresh system information
        self.system.refresh_all();

        // Get CPU load (average across all cores)
        let cpu_load = self.system.global_cpu_info().cpu_usage();

        // Get RAM usage
        let total_memory = self.system.total_memory() as f32 / 1_073_741_824.0; // Convert to GB
        let used_memory = self.system.used_memory() as f32 / 1_073_741_824.0;
        let ram_usage_percent = if total_memory > 0.0 {
            (used_memory / total_memory) * 100.0
        } else {
            0.0
        };

        // Temperature is not available on all platforms with sysinfo 0.30
        // Return 0.0 as placeholder
        let temperature = 0.0;

        SystemMetrics {
            cpu_load,
            ram_usage_percent,
            ram_used_gb: used_memory,
            ram_total_gb: total_memory,
            temperature_celsius: temperature,
            active_transactions: transaction_count,
        }
    }
}
