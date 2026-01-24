use serde::{Deserialize, Serialize};
use rand::Rng;

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
    pub region_health: std::collections::HashMap<String, String>,
}

pub struct DistributedSwarm {
    // Manages the container mesh
}

impl DistributedSwarm {
    pub fn new() -> Self {
        DistributedSwarm {}
    }

    pub fn launch(&self, request: &SwarmRequest) -> SwarmStatus {
        // SIMULATION: Spin up 1000 micro-agents
        let mut health = std::collections::HashMap::new();
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
        let swarm = DistributedSwarm::new();
        let req = SwarmRequest {
            agent_count: 100,
            regions: vec!["us-west".to_string()],
        };
        let status = swarm.launch(&req);
        assert_eq!(status.active_agents, 100);
        assert!(status.region_health.contains_key("us-west"));
    }
}
