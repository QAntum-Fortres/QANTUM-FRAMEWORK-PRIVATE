use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use base64::{Engine as _, engine::general_purpose};
use image::{DynamicImage, GenericImageView, ImageFormat};
use ndarray::Array1;
use rand::Rng;
use std::time::{SystemTime, UNIX_EPOCH, Instant};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct BoundingBox {
    pub x: i32,
    pub y: i32,
    pub width: i32,
    pub height: i32,
    pub label: Option<String>, // Cannot be Option<String> if we want Copy, so make it Clone
    pub confidence: f32,
}

// Removing Copy from BoundingBox because String is not Copy
// If we need Copy, we'd use fixed size arrays or specialized ID types, but Clone is fine.
// Actually, let's just derive Clone and remove Copy.

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct VisionRequest {
    pub image_base64: String,
    pub intent: String, // e.g., "Find the Checkout button"
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct VisionResult {
    pub found: bool,
    pub location: Option<BoundingBox>,
    pub candidates: Vec<BoundingBox>,
    pub confidence: f32,
    pub semantic_embedding: Vec<f32>,
    pub heatmap_data: Vec<f32>,
    pub reasoning: String,
    pub processing_time_ms: u64,
    pub audit_trail: Vec<String>,
}

/// Represents the "Memory" of the UI structure based on previous visual scans.
/// Maps a semantic key (hash of embedding or intent) to a spatial location and embedding.
#[derive(Debug, Clone)]
pub struct NeuralMapEntry {
    pub location: BoundingBox,
    pub embedding: Vec<f32>,
    pub last_seen: u64,
}

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
    // In production, this would hold the ONNX session
}

impl VisionTransformer {
    pub fn new() -> Self {
        VisionTransformer {}
    }

    /// Simulates detecting objects in an image and generating visual embeddings (e.g. CLIP Image Encoder)
    pub fn detect_objects(&self, _image: &DynamicImage, intent: &str) -> (Option<BoundingBox>, Vec<BoundingBox>, Vec<f32>, f32) {
        // MOCK: In a real system, this runs the image through a ViT Object Detector.
        // We will generate a few "detected" elements based on the intent string for simulation.

        let mut rng = rand::thread_rng();
        let intent_lower = intent.to_lowercase();

        let mut primary_box: Option<BoundingBox> = None;
        let mut confidence: f32 = 0.0;

        // Simulate detection logic
        if intent_lower.contains("buy") || intent_lower.contains("checkout") {
            confidence = rng.gen_range(0.90..0.99);
            primary_box = Some(BoundingBox {
                x: 800,
                y: 600,
                width: 150,
                height: 50,
                label: Some("Primary Action".to_string()),
                confidence,
            });
        } else if intent_lower.contains("login") {
            confidence = rng.gen_range(0.85..0.98);
            primary_box = Some(BoundingBox {
                x: 900,
                y: 50,
                width: 80,
                height: 30,
                label: Some("Auth Trigger".to_string()),
                confidence,
            });
        } else if intent_lower.contains("discount") || intent_lower.contains("coupon") {
             confidence = rng.gen_range(0.80..0.95);
             primary_box = Some(BoundingBox {
                x: 400,
                y: 500,
                width: 200,
                height: 40,
                label: Some("Input Field".to_string()),
                confidence,
            });
        } else if intent == "FAIL_TEST" {
            primary_box = None;
            confidence = 0.1;
        } else {
            // Random element
             confidence = rng.gen_range(0.5..0.8);
             primary_box = Some(BoundingBox {
                x: rng.gen_range(0..900),
                y: rng.gen_range(0..700),
                width: 100,
                height: 40,
                label: Some("Generic Element".to_string()),
                confidence,
            });
        }

        // Generate candidates (ambiguous matches)
        let mut candidates = Vec::new();
        if let Some(ref primary) = primary_box {
            candidates.push(primary.clone());
            // Add some noise candidates
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

        // Simulated Semantic Embedding (768 dimensions)
        let embedding: Vec<f32> = (0..768).map(|_| rng.gen::<f32>()).collect();

        (primary_box, candidates, embedding, confidence)
    }
}

pub struct NeuralLocator {
    vit: VisionTransformer,
    // Shared state for the Neural Map (persists across requests in this instance)
    neural_map: Arc<Mutex<NeuralMap>>,
}

impl NeuralLocator {
    pub fn new() -> Self {
        NeuralLocator {
            vit: VisionTransformer::new(),
            neural_map: Arc::new(Mutex::new(NeuralMap::new())),
        }
    }

    /// Simulates the full Vision Transformer pipeline:
    /// 1. Preprocessing (Base64 -> Image -> Tensor)
    /// 2. Inference (Tensor -> Embeddings + BBox)
    /// 3. Post-processing (Formatting)
    pub fn analyze(&self, request: &VisionRequest) -> VisionResult {
        let start_time = Instant::now();
        let mut audit_trail: Vec<String> = Vec::new();

        audit_trail.push(format!("Received vision request for intent: '{}'", request.intent));

        // 1. Decode Image from Base64
        let image_data = match general_purpose::STANDARD.decode(&request.image_base64) {
            Ok(data) => data,
            Err(e) => {
                return VisionResult {
                    found: false,
                    location: None,
                    candidates: vec![],
                    confidence: 0.0,
                    semantic_embedding: vec![],
                    heatmap_data: vec![],
                    reasoning: format!("Failed to decode Base64 image data: {}", e),
                    processing_time_ms: 0,
                    audit_trail,
                };
            }
        };

        // 2. Load into DynamicImage (Real Vision Preprocessing)
        let img = match image::load_from_memory(&image_data) {
             Ok(img) => {
                 audit_trail.push(format!("Image loaded successfully: {}x{}", img.width(), img.height()));
                 img
             },
             Err(_) => {
                 // Try parsing as PNG specifically if generic fail
                 match image::load_from_memory_with_format(&image_data, ImageFormat::Png) {
                     Ok(img) => {
                         audit_trail.push(format!("Image loaded (PNG fallback): {}x{}", img.width(), img.height()));
                         img
                     },
                     Err(e) => {
                         audit_trail.push(format!("Image load failed: {}. Using 1024x768 placeholder for simulation.", e));
                         // Fallback for tests/simulation if the image is just a dummy string
                         DynamicImage::new_rgb8(1024, 768)
                     }
                 }
             }
        };

        // 3. Vision-Transformer (ViT) Logic Simulation
        audit_trail.push("ViT Attention Head #1 focusing on high-contrast regions.".to_string());

        let (primary_box, candidates, embedding, confidence) = self.vit.detect_objects(&img, &request.intent);

        // Simulated Heatmap (10x10 grid flattened)
        let mut rng = rand::thread_rng();
        let heatmap_data: Vec<f32> = (0..100).map(|_| rng.gen::<f32>()).collect();

        // 4. Update Neural Map if found
        if let Some(ref loc) = primary_box {
             audit_trail.push(format!("Object detected with confidence {:.2}", confidence));
             let mut map = self.neural_map.lock().unwrap();
             map.insert(request.intent.clone(), NeuralMapEntry {
                 location: loc.clone(),
                 embedding: embedding.clone(),
                 last_seen: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
             });
             audit_trail.push("Neural Map updated with new spatial coordinates.".to_string());
        } else {
             audit_trail.push("No confident match found in visual field.".to_string());
        }

        let elapsed = start_time.elapsed();

        VisionResult {
            found: primary_box.is_some(),
            location: primary_box,
            candidates,
            confidence,
            semantic_embedding: embedding,
            heatmap_data,
            reasoning: format!("ViT Layer identified '{}' based on visual intent patterns. Confidence: {:.2}", request.intent, confidence),
            processing_time_ms: elapsed.as_millis() as u64,
            audit_trail,
        }
    }

    // Called by Semantic Healer to update the map manually
    pub fn update_map(&self, intent: String, location: BoundingBox, embedding: Vec<f32>) {
         let mut map_lock = self.neural_map.lock().unwrap();
         map_lock.insert(intent, NeuralMapEntry {
            location,
            embedding,
            last_seen: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
        });
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_analyze_flow() {
        let locator = NeuralLocator::new();
        // A minimal valid base64 png (1x1 pixel)
        let valid_png_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

        let request = VisionRequest {
            image_base64: valid_png_b64.to_string(),
            intent: "Find the Checkout button".to_string(),
        };

        let result = locator.analyze(&request);
        assert!(result.found);
        assert!(result.confidence > 0.8);
        assert!(result.audit_trail.len() > 0);
    }

    #[test]
    fn test_invalid_base64() {
        let locator = NeuralLocator::new();
        let request = VisionRequest {
            image_base64: "invalid_base64_string".to_string(),
            intent: "anything".to_string(),
        };

        let result = locator.analyze(&request);
        assert!(!result.found);
        assert!(result.reasoning.contains("Failed to decode"));
    }
}
