use serde::{Deserialize, Serialize};
use ndarray::Array1;
use crate::engine::neural_locator::{VisionTransformer, BoundingBox};
use base64::{Engine as _, engine::general_purpose};

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
    vit: VisionTransformer,
}

impl SemanticHealer {
    pub fn new() -> Self {
        SemanticHealer {
            threshold: 0.85,
            vit: VisionTransformer::new(),
        }
    }

    pub fn heal(&self, request: &HealRequest) -> HealResult {
        // 1. Decode Image
        let image_bytes = match general_purpose::STANDARD.decode(&request.current_image) {
            Ok(b) => b,
            Err(_) => return self.fail_result("Failed to decode Base64 image"),
        };

        let image = match image::load_from_memory(&image_bytes) {
            Ok(img) => img,
            Err(_) => image::DynamicImage::new_rgb8(1000, 1000), // Fallback for mock
        };

        // 2. Convert last known embedding to Array1
        let last_embedding = Array1::from(request.last_known_embedding.clone());
        if last_embedding.len() != 768 {
             return self.fail_result("Invalid embedding dimension (expected 768)");
        }

        // 3. Scan current view for candidates
        let detected_objects = self.vit.detect_objects(&image);

        // 4. Find best semantic match
        let mut best_score: f32 = -1.0;
        let mut best_label = String::new();

        for (_bbox, visual_vec, label) in detected_objects {
            let score = visual_vec.dot(&last_embedding) / (visual_vec.dot(&visual_vec).sqrt() * last_embedding.dot(&last_embedding).sqrt());

            if score > best_score {
                best_score = score;
                best_label = label;
            }
        }

        // 5. Check Threshold
        if best_score > self.threshold {
            HealResult {
                healed: true,
                new_selector: format!("veritas-semantic://{}", best_label), // Abstract selector
                similarity_score: best_score,
                reason: format!("Found element visually similar ({:.2}) to missing '{}'. Context preserved.", best_score, request.failed_selector),
            }
        } else {
             HealResult {
                healed: false,
                new_selector: "".to_string(),
                similarity_score: best_score,
                reason: format!("No element found with similarity > {:.2}. Best match: {:.2}", self.threshold, best_score),
            }
        }
    }

    fn fail_result(&self, reason: &str) -> HealResult {
        HealResult {
            healed: false,
            new_selector: "".to_string(),
            similarity_score: 0.0,
            reason: reason.to_string(),
        }
    }
}
