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
    pub available_agents: u32,
    pub status: String,
    pub threshold: u32,
}

pub struct DistributedSwarm {
    pub warm_pool: WarmPool,
}

impl DistributedSwarm {
    pub fn new() -> Self {
        DistributedSwarm {
            warm_pool: WarmPool {
                available_agents: 0,
                status: "COLD".to_string(),
                threshold: 20, // Replenish if below this
            },
        }
    }

    /// Pre-warms the agent container pool to mitigate "Cold Start" latency.
    /// This simulates loading ViT models into memory.
    pub fn pre_warm(&mut self) {
        // SIMULATION: Initialize 50 agents
        self.warm_pool.available_agents = 50;
        self.warm_pool.status = "READY".to_string();
    }

    /// Chaos Engineering: Simulate killing agents
    pub fn kill_agents(&mut self, count: u32) -> u32 {
        if count >= self.warm_pool.available_agents {
            self.warm_pool.available_agents = 0;
        } else {
            self.warm_pool.available_agents -= count;
        }
        self.check_replenish()
    }

    /// Progressive Warming: Automatically replenish if below threshold
    pub fn check_replenish(&mut self) -> u32 {
        if self.warm_pool.available_agents < self.warm_pool.threshold {
            // "Heal" the pool
            let deficit = 50 - self.warm_pool.available_agents;
            self.warm_pool.available_agents = 50;
            self.warm_pool.status = "REPLENISHED".to_string();
            return deficit; // Returned how many were added
        }
        0
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

    #[test]
    fn test_replenish() {
        let mut swarm = DistributedSwarm::new();
        swarm.pre_warm();
        swarm.kill_agents(40); // Leaves 10, which is < 20 (threshold)
        assert_eq!(swarm.warm_pool.available_agents, 50); // Should be healed back to full
        assert_eq!(swarm.warm_pool.status, "REPLENISHED");
    }
}
