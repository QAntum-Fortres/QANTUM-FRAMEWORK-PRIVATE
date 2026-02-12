use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct ObserverRequest {
    pub url: String,
    pub pending_network_requests: u32,
    pub dom_mutation_rate: u32, // Mutations per second
    pub layout_shifts: f32, // Cumulative Layout Shift (CLS)
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ObserverState {
    pub stable: bool,
    pub network_idle: bool,
    pub layout_shifts_score: f32,
    pub dom_stability_score: f32,
    pub amniotic_state_score: f32, // 0.0 to 1.0 (1.0 = Perfectly Stable)
}

pub struct StateChangeObserver {
    // Configuration thresholds
    network_threshold: u32,
}

impl StateChangeObserver {
    pub fn new() -> Self {
        StateChangeObserver {
            network_threshold: 0, // Zero Wait means 0 pending requests
        }
    }

    pub fn observe(&self, request: &ObserverRequest) -> ObserverState {
        // "Amniotic State" Calculation (Zero-Wait Architecture)
        // Instead of hard waits, we compute a stability score based on real metrics.

        // 1. Network Score (Weighted heavily)
        // 0 requests = 1.0, 1 = 0.8, 5+ = 0.0
        let network_score = if request.pending_network_requests == 0 {
            1.0
        } else {
            (1.0 - (request.pending_network_requests as f32 * 0.2)).max(0.0)
        };

        // 2. DOM Stability Score
        // 0 mutations = 1.0, >10 = 0.0
        let dom_score = (1.0 - (request.dom_mutation_rate as f32 * 0.1)).max(0.0);

        // 3. Layout Shift Score
        // CLS 0 = 1.0, CLS 0.1 = 0.5, CLS 0.25+ = 0.0
        let cls_score = (1.0 - (request.layout_shifts * 5.0)).max(0.0);

        // 4. Combined Amniotic Score
        // Weighted Average: Network 50%, DOM 30%, Layout 20%
        let amniotic_score = (network_score * 0.5) + (dom_score * 0.3) + (cls_score * 0.2);

        // Determine boolean flags based on thresholds
        let network_idle = request.pending_network_requests <= self.network_threshold;
        let stable = amniotic_score > 0.85;

        ObserverState {
            stable,
            network_idle,
            layout_shifts_score: cls_score,
            dom_stability_score: dom_score,
            amniotic_state_score: amniotic_score,
        }
    }
}

        let mut score = 1.0;
        if layout_shifts > 0 { score -= 0.1 * (layout_shifts as f32); }
        if pending_requests > 0 { score -= 0.2 * (pending_requests as f32); }
        if score < 0.0 { score = 0.0; }

    #[test]
    fn test_observer_stable() {
        let observer = StateChangeObserver::new();
        let req = ObserverRequest {
            url: "http://localhost".to_string(),
            pending_network_requests: 0,
            dom_mutation_rate: 0,
            layout_shifts: 0.0,
        };
        let state = observer.observe(&req);
        assert!(state.stable);
        assert_eq!(state.amniotic_state_score, 1.0);
    }

    #[test]
    fn test_observer_unstable() {
        let observer = StateChangeObserver::new();
        let req = ObserverRequest {
            url: "http://localhost".to_string(),
            pending_network_requests: 3, // Score 0.4 * 0.5 = 0.2
            dom_mutation_rate: 5, // Score 0.5 * 0.3 = 0.15
            layout_shifts: 0.1, // Score 0.5 * 0.2 = 0.1
        };
        // Total = 0.45
        let state = observer.observe(&req);
        assert!(!state.stable);
        assert!(state.amniotic_state_score < 0.85);
    }
}
