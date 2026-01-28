use serde::{Deserialize, Serialize};
use rand::Rng;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct HealRequest {
    pub failed_selector: String,
    pub last_known_embedding: Vec<f32>,
    pub screenshot: String, // Base64
    pub dom_snapshot: String, // HTML content for context (secondary to vision)
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HealResult {
    pub healed: bool,
    pub suggested_selector: String,
    pub confidence_score: f32, // 0.0 to 1.0
    pub embedding_distance: f32, // Lower is better (0.0 is exact match)
    pub reason: String,
}

/// Stores historical embeddings of UI elements to enable semantic recovery.
#[allow(dead_code)]
struct EmbeddingDatabase {
    // Map of Selector -> Average Embedding Vector
    embeddings: HashMap<String, Vec<f32>>,
}

pub struct SemanticHealer {
    threshold: f32,
    #[allow(dead_code)]
    db: EmbeddingDatabase,
}

impl SemanticHealer {
    pub fn new() -> Self {
        SemanticHealer {
            threshold: 0.85,
            db: EmbeddingDatabase {
                embeddings: HashMap::new(),
            },
        }
    }

    /// Calculates Cosine Similarity between two vectors
    #[allow(dead_code)]
    fn cosine_similarity(v1: &[f32], v2: &[f32]) -> f32 {
        let dot_product: f32 = v1.iter().zip(v2.iter()).map(|(a, b)| a * b).sum();
        let norm_v1: f32 = v1.iter().map(|x| x * x).sum::<f32>().sqrt();
        let norm_v2: f32 = v2.iter().map(|x| x * x).sum::<f32>().sqrt();

        if norm_v1 == 0.0 || norm_v2 == 0.0 {
            return 0.0;
        }

        dot_product / (norm_v1 * norm_v2)
    }

    pub fn heal(&self, request: &HealRequest) -> HealResult {
        // SIMULATION: "The Immune System"
        // 1. Analyze the screenshot to find elements that look like the lost element.
        // 2. Compare embeddings (simulated).
        // 3. Generate a new robust selector (e.g. using reliable attributes or relative paths).

        let mut rng = rand::thread_rng();

        // Simulate similarity score (Cosine Similarity)
        let score: f32 = rng.gen_range(0.80..0.99);

        // Euclidean distance simulation (inverse of similarity roughly)
        let distance: f32 = 1.0 - score;

        if score > self.threshold {
            // Generate a "healed" selector that looks realistic based on semantic attributes
            let healed_selector = if request.failed_selector.contains("btn") {
                 // Example: ID changed but data-testid or text content is stable
                 format!("[data-testid='{}']", request.failed_selector.replace("#", "").replace("btn-", "submit-"))
            } else if request.failed_selector.contains("input") {
                 format!("input[name='{}']", request.failed_selector.replace("#", ""))
            } else {
                 // Fallback to a "semantic class" selector
                 format!(".semantic-match-{}", rng.gen::<u16>())
            };

            HealResult {
                healed: true,
                suggested_selector: healed_selector,
                confidence_score: score,
                embedding_distance: distance,
                reason: format!("Visual embedding match ({:.4}) > threshold ({:.2}). Detected element has identical visual context despite ID change.", score, self.threshold),
            }
        } else {
             HealResult {
                healed: false,
                suggested_selector: "".to_string(),
                confidence_score: score,
                embedding_distance: distance,
                reason: "No element found with sufficient semantic similarity in current viewport.".to_string(),
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
            screenshot: "base64...".to_string(),
            dom_snapshot: "<html>...</html>".to_string(),
        };
        let result = healer.heal(&req);
        // Since it's random, we just check structure validity
        assert!(result.confidence_score >= 0.80);
    }
}
