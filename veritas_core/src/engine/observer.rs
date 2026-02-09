use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ObserverRequest {
    pub url: String,
    // Metrics provided by the frontend/SDK
    pub layout_shifts: u32,
    pub network_pending: u32,
    pub dom_mutations: u32,
    pub last_interaction_ms: u64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ObserverState {
    pub stable: bool,
    pub amniotic_state_score: f32, // 0.0 to 1.0
    pub recommendation: String, // "Wait", "Proceed"
}

pub struct StateChangeObserver {
    // In a real implementation, this might track historical stability per URL
}

impl StateChangeObserver {
    pub fn new() -> Self {
        StateChangeObserver {}
    }

    pub fn observe(&self, request: &ObserverRequest) -> ObserverState {
        // Calculate Amniotic State Score (Zero-Wait Architecture)
        // A score of 1.0 means perfect stability.

        let mut score = 1.0;

        // Heavy penalty for network activity (waiting for API calls)
        if request.network_pending > 0 {
            score -= 0.5; // Immediate drop below stable threshold
        }

        // Penalty for layout shifts (visual instability, CLS)
        score -= (request.layout_shifts as f32) * 0.1;

        // Penalty for recent DOM mutations (rendering)
        score -= (request.dom_mutations as f32) * 0.05;

        // Penalty for very recent interaction (animations still playing)
        if request.last_interaction_ms < 300 {
            score -= 0.2;
        }

        let final_score = score.max(0.0);
        let stable = final_score >= 0.95; // High bar for "Zero-Wait"

        ObserverState {
            stable,
            amniotic_state_score: final_score,
            recommendation: if stable {
                "Proceed".to_string()
            } else {
                "Wait for Amniotic Stability".to_string()
            },
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_observer_stable() {
        let observer = StateChangeObserver::new();
        let req = ObserverRequest {
            url: "http://localhost".to_string(),
            layout_shifts: 0,
            network_pending: 0,
            dom_mutations: 0,
            last_interaction_ms: 1000,
        };
        let state = observer.observe(&req);
        assert!(state.stable);
        assert!(state.amniotic_state_score > 0.9);
    }

    #[test]
    fn test_observer_unstable() {
        let observer = StateChangeObserver::new();
        let req = ObserverRequest {
            url: "http://localhost".to_string(),
            layout_shifts: 2,
            network_pending: 1,
            dom_mutations: 5,
            last_interaction_ms: 100,
        };
        let state = observer.observe(&req);
        assert!(!state.stable);
        assert!(state.amniotic_state_score < 0.9);
    }
}
