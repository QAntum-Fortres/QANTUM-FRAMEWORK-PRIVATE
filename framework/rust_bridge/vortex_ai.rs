use serde::{Deserialize, Serialize};
use tokio::time::{sleep, Duration};
use std::sync::{Arc, Mutex};
// use log::{info, warn}; // log macros might not be available or setup, using println for now

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiologyDepartment {
    status: String,
}

impl BiologyDepartment {
    pub fn new() -> Self {
        Self { status: "OFFLINE".to_string() }
    }
    pub fn initialize(&mut self) {
        self.status = "ONLINE".to_string();
        println!("[VORTEX] 🧬 Activating Biology Department (Self-Healing)...");
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IntelligenceDepartment {
    status: String,
}

impl IntelligenceDepartment {
    pub fn new() -> Self {
        Self { status: "OFFLINE".to_string() }
    }
    pub fn initialize(&mut self) {
        self.status = "ONLINE".to_string();
        println!("[VORTEX] 🧠 Activating Intelligence Department (Neural Nets)...");
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OmegaDepartment {
    status: String,
}

impl OmegaDepartment {
    pub fn new() -> Self {
         Self { status: "OFFLINE".to_string() }
    }
    pub fn initialize(&mut self) {
        self.status = "ONLINE".to_string();
        println!("[VORTEX] ⚡ Activating Omega Department (High-Freq Trading)...");
    }
}

#[derive(Clone)]
pub struct VortexAI {
    pub biology: Arc<Mutex<BiologyDepartment>>,
    pub intelligence: Arc<Mutex<IntelligenceDepartment>>,
    pub omega: Arc<Mutex<OmegaDepartment>>,
    is_running: Arc<Mutex<bool>>,
    cycles: Arc<Mutex<usize>>,
}

impl VortexAI {
    pub fn new() -> Self {
        Self {
            biology: Arc::new(Mutex::new(BiologyDepartment::new())),
            intelligence: Arc::new(Mutex::new(IntelligenceDepartment::new())),
            omega: Arc::new(Mutex::new(OmegaDepartment::new())),
            is_running: Arc::new(Mutex::new(false)),
            cycles: Arc::new(Mutex::new(0)),
        }
    }

    pub async fn start(&self) {
        {
            let mut running = self.is_running.lock().unwrap();
            if *running {
                return;
            }
            *running = true;
        }

        self.biology.lock().unwrap().initialize();
        self.intelligence.lock().unwrap().initialize();
        self.omega.lock().unwrap().initialize();

        println!("[VORTEX] 🌪️ VORTEX AI ENGINE ONLINE");

        // Spawn the cycle loop
        let vortex_clone = self.clone();
        tokio::spawn(async move {
            vortex_clone.run_cycle().await;
        });
    }

    pub fn stop(&self) {
        let mut running = self.is_running.lock().unwrap();
        *running = false;
        println!("[VORTEX] 🛑 Engine Halted.");
    }

    async fn run_cycle(&self) {
        loop {
            {
                let running = self.is_running.lock().unwrap();
                if !*running {
                    break;
                }
            }

            {
                let mut cycles = self.cycles.lock().unwrap();
                *cycles += 1;
                if *cycles % 10000 == 0 {
                    // println!("[VORTEX] ⚡ Heartbeat stable. Cycle #{}.", *cycles);
                }
            }

            // Simulate quantum task
            sleep(Duration::from_millis(10)).await;
        }
    }

    pub fn get_status(&self) -> String {
        let cycles = *self.cycles.lock().unwrap();
        let running = *self.is_running.lock().unwrap();
        format!("Vortex AI Status: {} | Cycles: {}", if running { "RUNNING" } else { "STOPPED" }, cycles)
    }
}
