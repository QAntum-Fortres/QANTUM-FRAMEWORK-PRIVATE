use serde::{Deserialize, Serialize};
use sysinfo::{System, SystemExt, CpuExt, ComponentExt};

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
        self.system.refresh_all();

        // Get CPU load (average across all cores)
        let cpu_load = self.system.global_cpu_info().cpu_usage();

        // Get RAM usage
        let total_memory = self.system.total_memory() as f32 / 1_073_741_824.0; // Convert to GB
        let used_memory = self.system.used_memory() as f32 / 1_073_741_824.0;
        let ram_usage_percent = (used_memory / total_memory) * 100.0;

        // Get temperature (from first available component)
        let temperature = self.system.components()
            .iter()
            .next()
            .map(|c| c.temperature())
            .unwrap_or(0.0);

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
