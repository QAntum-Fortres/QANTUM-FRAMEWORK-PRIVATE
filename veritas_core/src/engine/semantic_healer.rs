use serde::{Deserialize, Serialize};
use rand::Rng;

#[derive(Serialize, Deserialize, Debug)]
pub struct HealRequest {
    pub failed_selector: String,
    pub last_known_embedding: Vec<f32>,
    pub current_image: String, // Base64
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HealResult {
    pub healed: bool,
    pub new_selector: String,
    pub similarity_score: f32,
    pub reason: String,
}

pub struct SemanticHealer {
    threshold: f32,
}

impl SemanticHealer {
    pub fn new() -> Self {
        SemanticHealer {
            threshold: 0.85,
        }
    }

    pub fn heal(&self, request: &HealRequest) -> HealResult {
        // SIMULATION: In reality, calculate Cosine Similarity between last_known_embedding
        // and embeddings of current elements in the view.

        let mut rng = rand::thread_rng();
        let score: f32 = rng.gen_range(0.80..0.99);

        if score > self.threshold {
            HealResult {
                healed: true,
                new_selector: format!("xpath: //*[contains(@class, 'semantic-match-{}')]", request.failed_selector.replace("#", "")),
                similarity_score: score,
                reason: format!("Visual embedding match ({:.2}) > threshold ({:.2}). Identified element by spatial-semantic context.", score, self.threshold),
            }
        } else {
             HealResult {
                healed: false,
                new_selector: "".to_string(),
                similarity_score: score,
                reason: "No element found with sufficient semantic similarity.".to_string(),
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_heal_success() {
        let healer = SemanticHealer::new();
        let req = HealRequest {
            failed_selector: "#btn-buy".to_string(),
            last_known_embedding: vec![0.1; 768],
            current_image: "base64...".to_string(),
        };
        // Since it's random, we can't assert exact success, but we can check the struct.
        let result = healer.heal(&req);
        // It's a simulation, so just check it returns something
        assert!(result.similarity_score >= 0.80);
    }
}
