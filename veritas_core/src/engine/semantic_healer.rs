use serde::{Deserialize, Serialize};
use rand::{Rng, SeedableRng, rngs::StdRng};
use crate::engine::neural_locator::VisionTransformer;

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
    vit: VisionTransformer,
}

impl SemanticHealer {
    pub fn new() -> Self {
        SemanticHealer {
            threshold: 0.70, // Slightly lower threshold for combined score
            vit: VisionTransformer::new(),
        }
    }

    pub fn heal(&self, request: &HealRequest) -> HealResult {
        let mut audit_trail = Vec::new();
        audit_trail.push(format!("Initiating Semantic Healing for selector: '{}'", request.failed_selector));

        // 1. Snapshot Analysis (Mocked: In real system, we'd parse the current DOM/Image to get candidates)
        // We simulate finding a list of potential candidates on the page.
        // Some are similar strings, some are totally different.
        let candidates = vec![
            "#header-logo",
            ".navigation-link",
            "#submit-order-btn", // Similar to likely failed selector "#submit-btn"
            "button[type='submit']",
            ".footer-copyright",
            "#checkout-container"
        ];

        audit_trail.push(format!("Identified {} potential candidates on the page.", candidates.len()));

        let mut best_candidate = String::new();
        let mut best_score = 0.0;
        let mut best_reason = String::new();

        // 2. Iterate candidates and score them
        for candidate in candidates {
            // A. Structural Similarity (Levenshtein)
            let str_sim = self.string_similarity(&request.failed_selector, candidate);

            // B. Visual Similarity (Mocked Embedding Comparison)
            // In reality, we'd generate an embedding for the 'candidate' from the 'current_image'
            // Here we generate a deterministic pseudo-embedding based on the string to simulate stability
            let candidate_embedding = self.mock_embedding_from_string(candidate);
            let visual_sim = self.cosine_similarity(&request.last_known_embedding, &candidate_embedding);

            // C. Weighted Score
            // 40% Structural (String), 60% Visual (Embedding)
            let combined_score = (str_sim * 0.4) + (visual_sim * 0.6);

            if combined_score > best_score {
                best_score = combined_score;
                best_candidate = candidate.to_string();
                best_reason = format!(
                    "Combined Score: {:.2} (Str: {:.2}, Vis: {:.2}). Found semantic match.",
                    combined_score, str_sim, visual_sim
                );
            }
        }

        if best_score > self.threshold {
            audit_trail.push(format!("Healing successful: {}", best_reason));
            HealResult {
                healed: true,
                new_selector: best_candidate,
                similarity_score: best_score,
                reason: best_reason,
                audit_trail,
            }
        } else {
             audit_trail.push("Healing failed. No candidates met the confidence threshold.".to_string());
             HealResult {
                healed: false,
                new_selector: "".to_string(),
                similarity_score: best_score,
                reason: format!("Best match '{}' score {:.2} below threshold {:.2}", best_candidate, best_score, self.threshold),
                audit_trail,
            }
        }
    }

    fn string_similarity(&self, s1: &str, s2: &str) -> f32 {
        let len1 = s1.chars().count();
        let len2 = s2.chars().count();
        let max_len = std::cmp::max(len1, len2);

        if max_len == 0 { return 1.0; }

        let dist = levenshtein::levenshtein(s1, s2);
        1.0 - (dist as f32 / max_len as f32)
    }

    fn cosine_similarity(&self, v1: &[f32], v2: &[f32]) -> f32 {
        if v1.len() != v2.len() || v1.is_empty() { return 0.0; }

        let dot_product: f32 = v1.iter().zip(v2.iter()).map(|(a, b)| a * b).sum();
        let norm_a: f32 = v1.iter().map(|a| a * a).sum::<f32>().sqrt();
        let norm_b: f32 = v2.iter().map(|b| b * b).sum::<f32>().sqrt();

        if norm_a == 0.0 || norm_b == 0.0 { return 0.0; }

        dot_product / (norm_a * norm_b)
    }

    // Helper to generate a consistent embedding for testing/mocking
    fn mock_embedding_from_string(&self, s: &str) -> Vec<f32> {
        let mut seed: u64 = 0;
        for byte in s.bytes() {
            seed = seed.wrapping_add(byte as u64);
        }
        let mut rng = StdRng::seed_from_u64(seed);
        (0..768).map(|_| rng.gen::<f32>()).collect()
    }
}

// Minimal Levenshtein implementation to avoid external crate dependency for this snippet
mod levenshtein {
    pub fn levenshtein(a: &str, b: &str) -> usize {
        let len_a = a.chars().count();
        let len_b = b.chars().count();
        if len_a == 0 { return len_b; }
        if len_b == 0 { return len_a; }

        let mut matrix = vec![vec![0; len_b + 1]; len_a + 1];

        for i in 0..=len_a { matrix[i][0] = i; }
        for j in 0..=len_b { matrix[0][j] = j; }

        for (i, char_a) in a.chars().enumerate() {
            for (j, char_b) in b.chars().enumerate() {
                let cost = if char_a == char_b { 0 } else { 1 };
                matrix[i + 1][j + 1] = std::cmp::min(
                    std::cmp::min(matrix[i][j + 1] + 1, matrix[i + 1][j] + 1),
                    matrix[i][j] + cost
                );
            }
        }
        matrix[len_a][len_b]
    }
}
