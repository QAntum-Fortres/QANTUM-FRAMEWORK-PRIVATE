use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ObserverRequest {
    pub url: String,
    pub threshold: Option<f32>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ObserverState {
    pub stable: bool,
    pub network_idle: bool,
    pub layout_shifts: u32,
    pub dom_nodes: u32,
    pub amniotic_state_score: f32, // 0.0 to 1.0
    pub pending_requests: u32,
}

pub struct StateChangeObserver {
    // Hooks into browser CDP in real implementation
}

impl StateChangeObserver {
    pub fn new() -> Self {
        StateChangeObserver {}
    }

    pub fn observe(&self, request: &ObserverRequest) -> ObserverState {
        // SIMULATION: Zero-Wait Architecture
        // Returns the "Amniotic State" of the UI

        // Logic: Score starts at 1.0. Deduct for instability.
        let layout_shifts = 0;
        let pending_requests = 0;
        let dom_nodes = 1450;

        let mut score = 1.0;
        if layout_shifts > 0 { score -= 0.1 * (layout_shifts as f32); }
        if pending_requests > 0 { score -= 0.2 * (pending_requests as f32); }
        if score < 0.0 { score = 0.0; }

        let threshold = request.threshold.unwrap_or(0.95);
        let stable = score >= threshold;

        ObserverState {
            stable,
            network_idle: pending_requests == 0,
            layout_shifts,
            dom_nodes,
            amniotic_state_score: score,
            pending_requests,
        }
    }
}
