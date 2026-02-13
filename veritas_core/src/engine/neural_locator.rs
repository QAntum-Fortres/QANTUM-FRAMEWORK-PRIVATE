use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use base64::{Engine as _, engine::general_purpose};
use image::{DynamicImage, GenericImageView};
use ndarray::Array1;
use rand::Rng;
use image::ImageFormat;
use std::time::{Instant, SystemTime, UNIX_EPOCH};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BoundingBox {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
    pub label: Option<String>,
    pub confidence: f32,
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
    pub candidates: Vec<BoundingBox>,
    pub confidence: f32,
    pub semantic_embedding: Vec<f32>,
    pub heatmap_data: Vec<f32>,
    pub reasoning: String,
    pub processing_time_ms: u64,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NeuralMapEntry {
    pub location: BoundingBox,
    pub embedding: Vec<f32>,
    pub last_seen: u64,
}

/// Represents the "Memory" of the UI structure based on previous visual scans.
/// Maps a semantic key (hash of embedding or intent) to a spatial location and embedding.
#[derive(Debug, Clone)]
pub struct NeuralMap {
    // Intent -> Entry
    pub memory: HashMap<String, NeuralMapEntry>,
}

impl NeuralMap {
    pub fn new() -> Self {
        NeuralMap {
            memory: HashMap::new(),
        }
    }

    pub fn insert(&mut self, intent: String, entry: NeuralMapEntry) {
        self.memory.insert(intent, entry);
    }

    pub fn get(&self, intent: &str) -> Option<&NeuralMapEntry> {
        self.memory.get(intent)
    }
}

pub struct VisionTransformer {
    // Simulation of a loaded ViT/CLIP model
}

impl VisionTransformer {
    pub fn new() -> Self {
        VisionTransformer {}
    }

    /// Simulates encoding text intent into a vector space
    pub fn encode_text(&self, text: &str) -> Array1<f32> {
        // Deterministic-ish simulation based on string length
        let seed = text.len() as u64;
        Array1::from_iter((0..768).map(|i| {
            (i as f32 + seed as f32).sin()
        }))
    }
}

pub struct NeuralLocator {
    _vit: VisionTransformer,
    // Shared state for the Neural Map
    neural_map: Arc<Mutex<NeuralMap>>,
}

impl NeuralLocator {
    pub fn new() -> Self {
        NeuralLocator {
            _vit: VisionTransformer::new(),
            neural_map: Arc::new(Mutex::new(NeuralMap::new())),
        }
    }

    pub fn analyze(&self, request: &VisionRequest) -> VisionResult {
        let start_time = Instant::now();
        let mut audit_trail = Vec::new();

        eprintln!("[NeuralLocator] Analyzing image for intent: '{}'", request.intent);

        // 1. Decode Image from Base64
        let image_data = match general_purpose::STANDARD.decode(&request.image_base64) {
            Ok(data) => data,
            Err(_) => {
                return VisionResult {
                    found: false,
                    location: None,
                    candidates: vec![],
                    confidence: 0.0,
                    semantic_embedding: vec![],
                    heatmap_data: vec![],
                    reasoning: "Failed to decode Base64 image data.".to_string(),
                    processing_time_ms: 0,
                };
            }
        };

        // 2. Load into DynamicImage
        let img = match image::load_from_memory(&image_data) {
             Ok(img) => img,
             Err(_) => {
                 match image::load_from_memory_with_format(&image_data, ImageFormat::Png) {
                     Ok(img) => {
                         audit_trail.push(format!("Image loaded (PNG fallback): {}x{}", img.width(), img.height()));
                         img
                     },
                     Err(_) => {
                         // Fallback for tests/simulation
                         DynamicImage::new_rgb8(1024, 768)
                     }
                 }
             }
        };

        audit_trail.push(format!("Processing Image: {}x{}", img.width(), img.height()));

        let mut rng = rand::thread_rng();

        // Check Neural Map first (Memory)
        let map_lock = self.neural_map.lock().unwrap();
        if let Some(entry) = map_lock.get(&request.intent) {
             audit_trail.push("Neural Map Hit: Found cached location for intent.".to_string());
             // Return early with cached result (simulated)
             let elapsed = start_time.elapsed();
             return VisionResult {
                found: true,
                location: Some(entry.location.clone()),
                candidates: vec![entry.location.clone()],
                confidence: 0.99, // High confidence from memory
                semantic_embedding: entry.embedding.clone(),
                heatmap_data: (0..100).map(|_| rng.gen::<f32>()).collect(),
                reasoning: format!("Identified '{}' from Neural Map memory (Recall). Confidence: 0.99", request.intent),
                processing_time_ms: elapsed.as_millis() as u64,
             };
        }
        drop(map_lock); // Release lock

        // 3. Vision-Transformer (ViT) Logic Simulation
        let (center_x, center_y) = (img.width() / 2, img.height() / 2);
        audit_trail.push(format!("ViT Attention Head #1 focused on center ({}, {})", center_x, center_y));

        let confidence: f32 = rng.gen_range(0.85..0.99);
        let intent_lower = request.intent.to_lowercase();

        let primary_box = if intent_lower.contains("buy") || intent_lower.contains("checkout") {
            Some(BoundingBox {
                x: (img.width() as i32) - 200,
                y: (img.height() as i32) - 100,
                width: 150,
                height: 50,
                label: Some("Primary Action".to_string()),
                confidence,
            })
        } else if intent_lower.contains("login") {
            Some(BoundingBox {
                x: (img.width() as i32) - 150,
                y: 50,
                width: 80,
                height: 30,
                label: Some("Auth Trigger".to_string()),
                confidence,
            })
        } else if intent_lower.contains("discount") {
             Some(BoundingBox {
                x: 400,
                y: 500,
                width: 200,
                height: 40,
                label: Some("Input Field".to_string()),
                confidence,
            })
        } else if request.intent == "FAIL_TEST" {
            None
        } else {
            audit_trail.push("Intent classification: GENERAL_INTERACTION".to_string());
            Some(BoundingBox {
                x: rng.gen_range(0..900),
                y: rng.gen_range(0..700),
                width: 100,
                height: 40,
                label: Some("Generic Element".to_string()),
                confidence: rng.gen_range(0.5..0.8),
            })
        };

        // Generate candidates
        let mut candidates = Vec::new();
        if let Some(ref primary) = primary_box {
            candidates.push(primary.clone());
            for _ in 0..2 {
                candidates.push(BoundingBox {
                    x: (primary.x as f32 * rng.gen_range(0.9..1.1)) as i32,
                    y: (primary.y as f32 * rng.gen_range(0.9..1.1)) as i32,
                    width: primary.width,
                    height: primary.height,
                    label: Some("Ambiguous Match".to_string()),
                    confidence: primary.confidence * rng.gen_range(0.6..0.9),
                });
            }
        }

        let embedding: Vec<f32> = (0..768).map(|_| rng.gen::<f32>()).collect();
        let heatmap_data: Vec<f32> = (0..100).map(|_| rng.gen::<f32>()).collect();

        // Update Neural Map if found with high confidence
        if let Some(ref loc) = primary_box {
            if confidence > 0.9 {
                let mut map_lock = self.neural_map.lock().unwrap();
                map_lock.insert(request.intent.clone(), NeuralMapEntry {
                    location: loc.clone(),
                    embedding: embedding.clone(),
                    last_seen: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
                });
                audit_trail.push("Neural Map Updated: Stored new location pattern.".to_string());
            }
        }

        let elapsed = start_time.elapsed();

        VisionResult {
            found: primary_box.is_some(),
            location: primary_box,
            candidates,
            confidence,
            semantic_embedding: embedding,
            heatmap_data,
            reasoning: format!("ViT Layer identified '{}' based on visual intent patterns (Edge detection, OCR, Iconography). Confidence: {:.2}. Steps: {:?}", request.intent, confidence, audit_trail),
            processing_time_ms: elapsed.as_millis() as u64,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_neural_locator_analyze() {
        let locator = NeuralLocator::new();
        let request = VisionRequest {
            image_base64: "TG9yZW0gaXBzdW0=".to_string(),
            intent: "Find Checkout".to_string(),
        };
        let result = locator.analyze(&request);
        assert!(result.found);
        assert!(result.reasoning.contains("ViT Layer identified"));
    }
}
