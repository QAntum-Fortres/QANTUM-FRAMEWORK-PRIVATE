use serde::{Deserialize, Serialize};
use rand::Rng;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
pub struct GoalRequest {
    pub goal: String, // e.g. "Verify purchase with 10% discount"
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AgentStep {
    pub step_id: String,
    pub action: String,
    pub observation: String,
    pub reasoning: String,
    pub duration_ms: u64,
    pub status: String, // "completed", "failed"
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GoalResult {
    pub success: bool,
    pub goal_id: String,
    pub steps: Vec<AgentStep>,
    pub audit_log_url: String, // "Singularity Audit Log"
    pub total_duration_ms: u64,
}

pub struct GoalOrientedAgent {
    agent_id: String,
}

impl GoalOrientedAgent {
    pub fn new() -> Self {
        GoalOrientedAgent {
            agent_id: Uuid::new_v4().to_string(),
        }
    }

    pub fn execute(&self, request: &GoalRequest) -> GoalResult {
        // SIMULATION: Autonomous Agent Execution
        // 1. Decompose goal into high-level plan
        // 2. Iterate through plan

        let goal_id = Uuid::new_v4().to_string();
        let mut steps = Vec::new();
        let mut rng = rand::thread_rng();
        let mut total_duration = 0;

        // Mock Planning Phase
        let plan = self.decompose_goal(&request.goal);

        for plan_item in plan {
            // Mock Execution of each step
            let duration = rng.gen_range(50..300);
            total_duration += duration;

            let step = AgentStep {
                step_id: Uuid::new_v4().to_string(),
                action: plan_item.action,
                observation: plan_item.expected_observation, // In real agent, this comes from environment
                reasoning: format!("Executing step to satisfy goal: {}", request.goal),
                duration_ms: duration,
                status: "completed".to_string(),
            };
            steps.push(step);
        }

        GoalResult {
            success: true,
            goal_id,
            steps,
            audit_log_url: format!("s3://veritas-logs/{}/replay.mp4", Uuid::new_v4()),
            total_duration_ms: total_duration,
        }
    }

    fn decompose_goal(&self, goal: &str) -> Vec<PlanItem> {
        let lower_goal = goal.to_lowercase();
        if lower_goal.contains("discount") {
            vec![
                PlanItem { action: "Navigate to /checkout".to_string(), expected_observation: "Checkout page loaded".to_string() },
                PlanItem { action: "Locate 'Coupon Code' input".to_string(), expected_observation: "Input field found".to_string() },
                PlanItem { action: "Type 'SAVE10'".to_string(), expected_observation: "Text entered".to_string() },
                PlanItem { action: "Click 'Apply'".to_string(), expected_observation: "Price updated".to_string() },
                PlanItem { action: "Verify Total Price".to_string(), expected_observation: "Math correct".to_string() },
            ]
        } else if lower_goal.contains("login") {
            vec![
                PlanItem { action: "Navigate to /login".to_string(), expected_observation: "Login page loaded".to_string() },
                PlanItem { action: "Locate 'Username'".to_string(), expected_observation: "Input found".to_string() },
                PlanItem { action: "Locate 'Password'".to_string(), expected_observation: "Input found".to_string() },
                PlanItem { action: "Click 'Login'".to_string(), expected_observation: "Dashboard loaded".to_string() },
            ]
        } else {
            vec![
                PlanItem { action: "Explore Page".to_string(), expected_observation: "Page analyzed".to_string() },
            ]
        }
    }
}

struct PlanItem {
    action: String,
    expected_observation: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_agent_execution() {
        let agent = GoalOrientedAgent::new();
        let req = GoalRequest {
            goal: "Test checkout with discount".to_string(),
        };
        let result = agent.execute(&req);
        assert!(result.success);
        assert_eq!(result.steps.len(), 5);
    }
}
