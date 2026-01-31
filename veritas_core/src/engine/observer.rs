use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ObserverRequest {
    pub metrics: PerformanceMetrics,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct PerformanceMetrics {
    pub layout_shifts: u32,
    pub network_requests_inflight: u32,
    pub dom_nodes: u32,
    pub fps: f32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ObserverResult {
    pub is_stable: bool,
    pub amniotic_state_score: f32,
    pub message: String,
}

pub struct StateChangeObserver {
    // Configuration for "Stable"
    max_inflight: u32,
    min_fps: f32,
}

impl StateChangeObserver {
    pub fn new() -> Self {
        StateChangeObserver {
            max_inflight: 0,
            min_fps: 30.0,
        }
    }

    pub fn observe(&self, request: &ObserverRequest) -> ObserverResult {
        // ZERO-WAIT ARCHITECTURE (THE OMEGA LAYER)
        // Determines if the "Amniotic State" of the UI is stable.

        // Calculate stability score (0.0 - 1.0)
        let stability_score = if request.metrics.network_requests_inflight == 0 && request.metrics.layout_shifts == 0 {
            1.0
        } else if request.metrics.network_requests_inflight < 2 {
            0.8
        } else {
            0.4
        };

        let is_stable = stability_score > 0.9 && request.metrics.fps >= self.min_fps;

        ObserverResult {
            is_stable,
            amniotic_state_score: stability_score,
            message: if is_stable {
                "Amniotic State Stable. Proceeding with interaction.".to_string()
            } else {
                format!("Unstable State. Inflight: {}, Layout Shifts: {}", request.metrics.network_requests_inflight, request.metrics.layout_shifts)
            },
        }
    }
}
