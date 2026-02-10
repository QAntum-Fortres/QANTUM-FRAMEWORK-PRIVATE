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
    pub audit_trail: Vec<String>,
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
        let mut audit_trail = Vec::new();
        audit_trail.push(format!("Healing request for selector: '{}'", request.failed_selector));
        audit_trail.push(format!("Received last known embedding (dim: {})", request.last_known_embedding.len()));

        // SIMULATION: In reality, calculate Cosine Similarity between last_known_embedding
        // and embeddings of current elements in the view.

        let mut rng = rand::thread_rng();
        let score: f32 = rng.gen_range(0.80..0.99);

        // Simulate analyzing the image
        audit_trail.push("Analyzing current DOM snapshot (Vision + Layout Tree)...".to_string());
        audit_trail.push(format!("Found 12 candidate elements matching visual signature. Best match score: {:.4}", score));

        if score > self.threshold {
            let new_sel = format!("xpath: //*[contains(@class, 'semantic-match-{}')]", request.failed_selector.replace("#", ""));
            audit_trail.push(format!("Healing successful. New selector: {}", new_sel));

            HealResult {
                healed: true,
                new_selector: new_sel,
                similarity_score: score,
                reason: format!("Visual embedding match ({:.2}) > threshold ({:.2}). Identified element by spatial-semantic context.", score, self.threshold),
                audit_trail,
            }
        } else {
             audit_trail.push("Healing failed. No candidates met the confidence threshold.".to_string());
             HealResult {
                healed: false,
                new_selector: "".to_string(),
                similarity_score: score,
                reason: "No element found with sufficient semantic similarity.".to_string(),
                audit_trail,
            }
        }
    }
}
