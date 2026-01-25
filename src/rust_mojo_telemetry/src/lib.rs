// LwaS Telemetry Reporter - The Eye of Sauron
// Real-time market monitoring and system telemetry
//
// ENTERPRISE DOCUMENTATION:
// This module acts as the central monitoring system for the QANTUM framework,
// tracking system performance, market movements, and reporting to the Dashboard.
//
// Features:
// - Real-time system metrics collection
// - Market data aggregation
// - Performance monitoring
// - Dashboard reporting integration
// - Alert system for anomalies

use serde::{Deserialize, Serialize};
use sysinfo::System;
use chrono::{DateTime, Utc};
use std::collections::VecDeque;

/// System telemetry data structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemTelemetry {
    pub cpu_usage: f32,
    pub ram_used_gb: f32,
    pub ram_total_gb: f32,
    pub uptime_secs: u64,
    pub timestamp: DateTime<Utc>,
    pub resonance: f32, // Port 8890 reference
}

/// Market telemetry data structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarketTelemetry {
    pub market_id: String,
    pub price: f64,
    pub volume: f64,
    pub volatility: f64,
    pub timestamp: DateTime<Utc>,
}

/// Comprehensive telemetry report
#[derive(Debug, Serialize, Deserialize)]
pub struct TelemetryReport {
    pub system: SystemTelemetry,
    pub markets: Vec<MarketTelemetry>,
    pub alerts: Vec<Alert>,
    pub report_id: String,
    pub generated_at: DateTime<Utc>,
}

/// Alert system for anomaly detection
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Alert {
    pub severity: AlertSeverity,
    pub message: String,
    pub source: String,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AlertSeverity {
    Info,
    Warning,
    Critical,
}

/// Main telemetry reporter engine
pub struct TelemetryReporter {
    system: System,
    market_history: VecDeque<MarketTelemetry>,
    alerts: Vec<Alert>,
    max_history_size: usize,
}

impl TelemetryReporter {
    pub fn new() -> Self {
        Self {
            system: System::new_all(),
            market_history: VecDeque::new(),
            alerts: Vec::new(),
            max_history_size: 1000,
        }
    }

    /// Collects current system telemetry
    pub fn collect_system_telemetry(&mut self) -> SystemTelemetry {
        // Refresh system information
        self.system.refresh_all();
        std::thread::sleep(std::time::Duration::from_millis(100));
        self.system.refresh_cpu_all();

        let cpu_usage = self.system.global_cpu_usage();
        let ram_used = self.system.used_memory() as f32 / 1024.0 / 1024.0 / 1024.0;
        let ram_total = self.system.total_memory() as f32 / 1024.0 / 1024.0 / 1024.0;
        let uptime = System::uptime();

        let telemetry = SystemTelemetry {
            cpu_usage,
            ram_used_gb: ram_used,
            ram_total_gb: ram_total,
            uptime_secs: uptime,
            timestamp: Utc::now(),
            resonance: 0.8890, // Port 8890 reference
        };

        // Check for alerts
        self.check_system_alerts(&telemetry);

        telemetry
    }

    /// Records market telemetry data
    pub fn record_market_data(&mut self, market: MarketTelemetry) {
        // Check for market anomalies
        self.check_market_alerts(&market);

        // Add to history with size limit
        self.market_history.push_back(market);
        if self.market_history.len() > self.max_history_size {
            self.market_history.pop_front();
        }
    }

    /// Checks system metrics for alert conditions
    fn check_system_alerts(&mut self, telemetry: &SystemTelemetry) {
        // CPU usage alerts
        if telemetry.cpu_usage > 90.0 {
            self.add_alert(Alert {
                severity: AlertSeverity::Critical,
                message: format!("Critical CPU usage: {:.2}%", telemetry.cpu_usage),
                source: "SystemTelemetry".to_string(),
                timestamp: Utc::now(),
            });
        } else if telemetry.cpu_usage > 75.0 {
            self.add_alert(Alert {
                severity: AlertSeverity::Warning,
                message: format!("High CPU usage: {:.2}%", telemetry.cpu_usage),
                source: "SystemTelemetry".to_string(),
                timestamp: Utc::now(),
            });
        }

        // RAM usage alerts
        let ram_percent = (telemetry.ram_used_gb / telemetry.ram_total_gb) * 100.0;
        if ram_percent > 85.0 {
            self.add_alert(Alert {
                severity: AlertSeverity::Critical,
                message: format!("Critical RAM usage: {:.2}%", ram_percent),
                source: "SystemTelemetry".to_string(),
                timestamp: Utc::now(),
            });
        }
    }

    /// Checks market data for anomalies
    fn check_market_alerts(&mut self, market: &MarketTelemetry) {
        // Volatility alerts
        if market.volatility > 50.0 {
            self.add_alert(Alert {
                severity: AlertSeverity::Warning,
                message: format!("High market volatility: {:.2}", market.volatility),
                source: format!("Market:{}", market.market_id),
                timestamp: Utc::now(),
            });
        }

        // Volume anomaly detection
        if market.volume > 1_000_000.0 {
            self.add_alert(Alert {
                severity: AlertSeverity::Info,
                message: format!("Unusual trading volume: {:.2}", market.volume),
                source: format!("Market:{}", market.market_id),
                timestamp: Utc::now(),
            });
        }
    }

    /// Adds an alert to the system
    fn add_alert(&mut self, alert: Alert) {
        self.alerts.push(alert);
        
        // Keep only recent alerts (last 100)
        if self.alerts.len() > 100 {
            self.alerts.drain(0..self.alerts.len() - 100);
        }
    }

    /// Generates a comprehensive telemetry report
    pub fn generate_report(&mut self) -> TelemetryReport {
        let system_telemetry = self.collect_system_telemetry();
        
        TelemetryReport {
            system: system_telemetry,
            markets: self.market_history.iter().cloned().collect(),
            alerts: self.alerts.clone(),
            report_id: format!("report_{}", Utc::now().timestamp()),
            generated_at: Utc::now(),
        }
    }

    /// Gets recent alerts
    pub fn get_alerts(&self) -> &[Alert] {
        &self.alerts
    }

    /// Clears all alerts
    pub fn clear_alerts(&mut self) {
        self.alerts.clear();
    }
}

impl Default for TelemetryReporter {
    fn default() -> Self {
        Self::new()
    }
}

/// FFI function for external integrations
#[no_mangle]
pub extern "C" fn get_system_telemetry() -> *mut u8 {
    let mut reporter = TelemetryReporter::new();
    let telemetry = reporter.collect_system_telemetry();
    
    match serde_json::to_string(&telemetry) {
        Ok(json_str) => {
            let bytes = json_str.into_bytes();
            let ptr = bytes.as_ptr() as *mut u8;
            std::mem::forget(bytes);
            ptr
        }
        Err(_) => std::ptr::null_mut(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_telemetry_reporter_creation() {
        let reporter = TelemetryReporter::new();
        assert_eq!(reporter.market_history.len(), 0);
        assert_eq!(reporter.alerts.len(), 0);
    }

    #[test]
    fn test_system_telemetry_collection() {
        let mut reporter = TelemetryReporter::new();
        let telemetry = reporter.collect_system_telemetry();
        assert!(telemetry.cpu_usage >= 0.0);
        assert!(telemetry.ram_total_gb > 0.0);
    }

    #[test]
    fn test_market_data_recording() {
        let mut reporter = TelemetryReporter::new();
        let market = MarketTelemetry {
            market_id: "BTC/USD".to_string(),
            price: 50000.0,
            volume: 1000.0,
            volatility: 15.0,
            timestamp: Utc::now(),
        };
        
        reporter.record_market_data(market);
        assert_eq!(reporter.market_history.len(), 1);
    }

    #[test]
    fn test_report_generation() {
        let mut reporter = TelemetryReporter::new();
        let report = reporter.generate_report();
        assert!(report.system.ram_total_gb > 0.0);
    }
}
