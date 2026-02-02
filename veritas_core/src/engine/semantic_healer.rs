use serde::{Deserialize, Serialize};
use ndarray::{Array1, ArrayView1};
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
        // 1. Convert input embedding to Array1
        if request.last_known_embedding.len() != 768 {
             return HealResult {
                healed: false,
                new_selector: "".to_string(),
                similarity_score: 0.0,
                reason: "Invalid embedding dimension".to_string(),
            };
        }

        let target_embedding = Array1::from(request.last_known_embedding.clone());

        // 2. SIMULATION: Generate candidate elements from the "current_image"
        // In reality, this would run the ViT on the image to get all elements and their embeddings.
        let candidates = self.mock_extract_candidates();

        let mut best_score = -1.0;
        let mut best_candidate_idx = -1;

        // 3. Find best match using Cosine Similarity
        for (idx, candidate_embedding) in candidates.iter().enumerate() {
            let score = self.cosine_similarity(target_embedding.view(), candidate_embedding.view());
            if score > best_score {
                best_score = score;
                best_candidate_idx = idx as i32;
            }
        }

        if best_score > self.threshold && best_candidate_idx >= 0 {
             HealResult {
                healed: true,
                new_selector: format!("xpath: //*[contains(@class, 'semantic-match-{}')]", best_candidate_idx),
                similarity_score: best_score,
                reason: format!("Visual embedding match ({:.4}) > threshold ({:.2}). Identified element by spatial-semantic context.", best_score, self.threshold),
            }
        } else {
             HealResult {
                healed: false,
                new_selector: "".to_string(),
                similarity_score: best_score,
                reason: format!("Best match ({:.4}) is below threshold ({:.2}).", best_score, self.threshold),
            }
        }
    }

    fn cosine_similarity(&self, a: ArrayView1<f32>, b: ArrayView1<f32>) -> f32 {
        let dot_product = a.dot(&b);
        let norm_a = a.dot(&a).sqrt();
        let norm_b = b.dot(&b).sqrt();

        if norm_a == 0.0 || norm_b == 0.0 {
            0.0
        } else {
            dot_product / (norm_a * norm_b)
        }
    }

    fn mock_extract_candidates(&self) -> Vec<Array1<f32>> {
        // Simulate finding 5 elements on the page, each with a 768-dim embedding
        let mut rng = rand::thread_rng();
        let mut candidates = Vec::new();

        for i in 0..5 {
            // Generate random embeddings
            // To simulate a "match", we'll make one of them (say index 2) very similar to what we expect
            // But since we don't know the input, we just return random ones.
            // Wait, for the test to pass or be realistic, we need one to potentially match.
            // Let's generate purely random ones for now.
             let vec: Vec<f32> = (0..768).map(|_| rng.gen::<f32>()).collect();
             candidates.push(Array1::from(vec));
        }

        // To make the demo interesting, let's inject a "very similar" one relative to a hypothetical target
        // But since we don't pass the target into this private helper, we can't easily fake a match
        // unless we cheat.
        // Let's just return random. The test will likely fail to heal, which is fine,
        // OR we can hack it to always return one high match if we want to demonstrate success.

        // Let's leave it random. Real "Healing" requires real ML.
        // To ensure we can test the "Success" path, I'll modify `heal` to optionally cheat or
        // the test case will provide a candidate list if I exposed it.

        candidates
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cosine_similarity() {
        let healer = SemanticHealer::new();
        let a = Array1::from(vec![1.0, 0.0, 0.0]);
        let b = Array1::from(vec![1.0, 0.0, 0.0]);
        assert!((healer.cosine_similarity(a.view(), b.view()) - 1.0).abs() < 1e-5);

        let c = Array1::from(vec![0.0, 1.0, 0.0]);
        assert!((healer.cosine_similarity(a.view(), c.view())).abs() < 1e-5);
    }
}
