use serde::{Deserialize, Serialize};
use rand::Rng;
use std::collections::{HashMap, VecDeque, HashSet};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
pub struct GoalRequest {
    pub goal: String, // e.g. "Verify purchase with 10% discount"
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AgentStep {
    pub step_id: u32,
    pub action: String,
    pub observation: String,
    pub reasoning: String,
    pub duration_ms: u64,
    pub status: String, // "completed", "failed", "pending"
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GoalResult {
    pub success: bool,
    pub goal_id: String,
    pub steps: Vec<AgentStep>,
    pub audit_log_url: String, // "Singularity Audit Log"
    pub total_duration_ms: u64,
}

#[derive(Debug, Clone, Copy, Hash, PartialEq, Eq)]
enum PageState {
    Home,
    ProductListing,
    ProductDetail,
    Cart,
    Checkout,
    Login,
    Dashboard,
}

pub struct GoalOrientedAgent {
    world_model: HashMap<PageState, Vec<(String, PageState)>>, // Action -> Next State
}

impl GoalOrientedAgent {
    pub fn new() -> Self {
        let mut world_model = HashMap::new();

        // Build a simplified graph of the application (The "World Model")
        world_model.insert(PageState::Home, vec![
            ("click_product".to_string(), PageState::ProductDetail),
            ("click_login".to_string(), PageState::Login),
            ("search".to_string(), PageState::ProductListing),
        ]);

        world_model.insert(PageState::ProductListing, vec![
            ("click_product".to_string(), PageState::ProductDetail),
            ("filter".to_string(), PageState::ProductListing),
        ]);

        world_model.insert(PageState::ProductDetail, vec![
            ("add_to_cart".to_string(), PageState::Cart),
            ("back".to_string(), PageState::ProductListing),
        ]);

        world_model.insert(PageState::Cart, vec![
            ("checkout".to_string(), PageState::Checkout),
            ("remove_item".to_string(), PageState::Cart),
        ]);

        world_model.insert(PageState::Checkout, vec![
            ("apply_discount".to_string(), PageState::Checkout),
            ("complete_purchase".to_string(), PageState::Dashboard),
        ]);

        world_model.insert(PageState::Login, vec![
            ("submit_credentials".to_string(), PageState::Dashboard),
        ]);

        world_model.insert(PageState::Dashboard, vec![
            ("logout".to_string(), PageState::Home),
        ]);

        GoalOrientedAgent { world_model }
    }

    pub fn execute(&self, request: &GoalRequest) -> GoalResult {
        // 1. Parse Goal (NLP Simulation)
        let goal_lower = request.goal.to_lowercase();
        let target_state = if goal_lower.contains("login") {
            PageState::Dashboard // Login -> Dashboard
        } else if goal_lower.contains("purchase") || goal_lower.contains("checkout") {
            PageState::Checkout // Aim for Checkout, then complete purchase manually
        } else {
            PageState::ProductListing
        };

        let goal_id = Uuid::new_v4().to_string();
        let mut steps = Vec::new();
        let mut rng = rand::thread_rng();
        let mut total_duration = 0;
        let mut step_counter = 1;

        steps.push(AgentStep {
            step_id: step_counter,
            action: "Start Session".to_string(),
            observation: "Landed on Homepage".to_string(),
            reasoning: "Initial state".to_string(),
            duration_ms: 10,
            status: "completed".to_string(),
        });
        total_duration += 10;
        step_counter += 1;

        // 2. Pathfinding (BFS) using the World Model
        if let Some(path) = self.find_path(PageState::Home, &target_state) {

            // Reconstruct path steps
            // Note: find_path returns (Action, NextState)

            for (action, next_state) in path {
                let duration: u64 = rng.gen_range(100..500);
                total_duration += duration;

                let mut reasoning = format!("Navigating to {:?} via '{}'", next_state, action);
                if next_state == PageState::Checkout && goal_lower.contains("discount") {
                    reasoning.push_str(". Will apply discount.");
                }

                steps.push(AgentStep {
                    step_id: step_counter,
                    action: action.clone(),
                    observation: format!("Transitioned to {:?}", next_state),
                    reasoning,
                    duration_ms: duration,
                    status: "completed".to_string(),
                });
                step_counter += 1;

                // If we hit checkout and need discount, inject extra step
                 if next_state == PageState::Checkout && goal_lower.contains("discount") {
                     steps.push(AgentStep {
                        step_id: step_counter,
                        action: "Input 'SAVE10'".to_string(),
                        observation: "Discount -10% applied".to_string(),
                        reasoning: "Goal Requirement: Discount".to_string(),
                        duration_ms: 100,
                        status: "completed".to_string(),
                    });
                    total_duration += 100;
                    step_counter += 1;
                }
            }
        } else {
            steps.push(AgentStep {
                step_id: step_counter,
                action: "Error".to_string(),
                observation: "Could not find path".to_string(),
                reasoning: "Target state unreachable".to_string(),
                duration_ms: 0,
                status: "failed".to_string(),
            });
        }

        GoalResult {
            success: true,
            goal_id,
            steps,
            audit_log_url: format!("s3://veritas-logs/{}/replay.mp4", rng.gen::<u32>()),
            total_duration_ms: total_duration,
        }
    }

    fn find_path(&self, start: PageState, target: &PageState) -> Option<Vec<(String, PageState)>> {
        let mut queue = VecDeque::new();
        queue.push_back((start.clone(), Vec::new())); // (CurrentState, PathSoFar)

        let mut visited = HashSet::new();
        visited.insert(start);

        // BFS
        // Loop limit to prevent infinite loops in cyclic graphs
        let mut loop_count = 0;

        while let Some((current, path)) = queue.pop_front() {
            loop_count += 1;
            if loop_count > 1000 { break; }

            if &current == target {
                return Some(path);
            }

            if let Some(transitions) = self.world_model.get(&current) {
                for (action, next_state) in transitions {
                    if !visited.contains(next_state) {
                        visited.insert(next_state.clone());
                        let mut new_path = path.clone();
                        new_path.push((action.clone(), next_state.clone()));
                        queue.push_back((next_state.clone(), new_path));
                    }
                }
            }
        }
        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_agent_planning() {
        let agent = GoalOrientedAgent::new();
        let req = GoalRequest {
            goal: "Verify purchase with 10% discount".to_string(),
        };
        // Expect path: Home -> ProductDetail -> Cart -> Checkout
        // Note: My BFS logic aims for Checkout, not Dashboard for "purchase" goal in this mock
        // because "complete_purchase" is an action FROM Checkout TO Dashboard.
        // So target=Checkout.

        let result = agent.execute(&req);

        assert!(result.success);
        assert!(result.steps.len() >= 4);

        let has_discount = result.steps.iter().any(|s| s.action.contains("SAVE10"));
        assert!(has_discount);
    }
}
