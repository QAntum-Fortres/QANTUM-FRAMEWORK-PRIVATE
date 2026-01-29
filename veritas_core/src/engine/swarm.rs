use serde::{Deserialize, Serialize};
use rand::Rng;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct SwarmRequest {
    pub agent_count: u32, // e.g., 1000
    pub regions: Vec<String>, // ["us-east-1", "eu-central-1"]
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SwarmStatus {
    pub active_agents: u32,
    pub completed_tasks: u32,
    pub throughput_tps: f32,
    pub region_health: HashMap<String, String>,
}

pub struct WarmPool {
    available_agents: u32,
    status: String,
}

pub struct DistributedSwarm {
    warm_pool: WarmPool,
}

impl DistributedSwarm {
    pub fn new() -> Self {
        DistributedSwarm {
            warm_pool: WarmPool {
                available_agents: 0,
                status: "COLD".to_string(),
            },
        }
    }

    /// Pre-warms the agent container pool to mitigate "Cold Start" latency.
    /// This simulates loading ViT models into memory.
    pub fn pre_warm(&mut self) {
        // SIMULATION: Initialize 50 agents
        self.warm_pool.available_agents = 50;
        self.warm_pool.status = "READY".to_string();
        // println!("[PHYSICS] Warm Pool Initialized: 50 Agents (ViT Models Loaded)");
    }

    pub fn launch(&self, request: &SwarmRequest) -> SwarmStatus {
        // SIMULATION: Spin up 1000 micro-agents
        let mut health = HashMap::new();
        for region in &request.regions {
            health.insert(region.clone(), "OPTIMAL".to_string());
        }

        let mut rng = rand::thread_rng();

        SwarmStatus {
            active_agents: request.agent_count,
            completed_tasks: 0,
            throughput_tps: request.agent_count as f32 * rng.gen_range(1.5..5.0),
            region_health: health,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_swarm() {
        let mut swarm = DistributedSwarm::new();
        swarm.pre_warm();
        assert_eq!(swarm.warm_pool.available_agents, 50);
        assert_eq!(swarm.warm_pool.status, "READY");

        let req = SwarmRequest {
            agent_count: 100,
            regions: vec!["us-west".to_string()],
        };
        let status = swarm.launch(&req);
        assert_eq!(status.active_agents, 100);
        assert!(status.region_health.contains_key("us-west"));
    }
}
