use serde::{Deserialize, Serialize};
use rand::Rng;
use ndarray::Array1;
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BoundingBox {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct VisionRequest {
    pub image_base64: String,
    pub intent: String, // e.g., "Find the Checkout button"
}

#[derive(Serialize, Deserialize, Debug)]
pub struct VisionResult {
    pub found: bool,
    pub location: Option<BoundingBox>,
    pub confidence: f32,
    pub semantic_embedding: Vec<f32>, // Serialized vector for transport
    pub reasoning: String,
}

#[derive(Debug, Clone)]
pub struct VisualElement {
    pub intent_label: String,
    pub embedding: Array1<f32>,
    pub location: BoundingBox,
    pub last_seen: u64,
}

pub struct NeuralLocator {
    // Neural Map: Persists knowledge of where things are
    neural_map: HashMap<String, VisualElement>,
}

impl NeuralLocator {
    pub fn new() -> Self {
        NeuralLocator {
            neural_map: HashMap::new(),
        }
    }

    pub fn analyze(&self, request: &VisionRequest) -> VisionResult {
        // SIMULATION: The "Vision-Transformer" Logic
        // In a real world scenario, this would infer from the ViT model.
        // For this architecture demo, we simulate the embeddings and detection.

        let mut rng = rand::thread_rng();
        let confidence: f32 = rng.gen_range(0.85..0.99);
        let intent_lower = request.intent.to_lowercase();

        // 1. Simulate Detection based on Intent
        let location = if intent_lower.contains("buy") || intent_lower.contains("checkout") {
            Some(BoundingBox {
                x: 1024 - 200, // Bottom right-ish
                y: 768 - 100,
                width: 150,
                height: 50,
            })
        } else if intent_lower.contains("login") {
            Some(BoundingBox {
                x: 800,
                y: 50,
                width: 80,
                height: 30,
            })
        } else if intent_lower.contains("discount") || intent_lower.contains("coupon") {
             Some(BoundingBox {
                x: 400,
                y: 500,
                width: 200,
                height: 40,
            })
        } else {
            // "Not found" or random generic element
            if rng.gen_bool(0.2) {
                None
            } else {
                Some(BoundingBox {
                    x: rng.gen_range(0..1024),
                    y: rng.gen_range(0..768),
                    width: 100,
                    height: 40,
                })
            }
        };

        // 2. Generate Semantic Embedding (768 dimensions)
        // If we found it, generate a stable-ish embedding based on the intent string's hash (mocked)
        // In reality, this comes from the ViT final layer.
        let embedding_vec: Vec<f32> = if location.is_some() {
            (0..768).map(|i| {
                // simple deterministic noise based on intent len + index
                let seed = (intent_lower.len() + i) as f64;
                (seed.sin() * 0.5 + 0.5) as f32
            }).collect()
        } else {
            vec![]
        };

        VisionResult {
            found: location.is_some(),
            location,
            confidence,
            semantic_embedding: embedding_vec,
            reasoning: format!("ViT Layer identified '{}' based on visual intent patterns (Edge detection, OCR, Iconography). Confidence: {:.2}", request.intent, confidence),
        }
    }

    // Helper to update the internal map (would be called after successful interactions)
    pub fn update_map(&mut self, intent: String, element: VisualElement) {
        self.neural_map.insert(intent, element);
    }
}
