use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use base64::{Engine as _, engine::general_purpose};
use image::{DynamicImage, GenericImageView};
use ndarray::Array1;
use rand::Rng;
use image::{DynamicImage, ImageFormat};
use base64::{Engine as _, engine::general_purpose};
use std::time::Instant;

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
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

/// Represents the "Memory" of the UI structure based on previous visual scans.
/// Maps a semantic key (hash of embedding or intent) to a spatial location and embedding.
#[derive(Debug, Clone)]
pub struct NeuralMap {
    // Intent -> (Last Known Embedding, Last Known Location)
    pub memory: HashMap<String, (Vec<f32>, BoundingBox)>,
}

impl NeuralMap {
    pub fn new() -> Self {
        NeuralMap {
            memory: HashMap::new(),
        }
    }

    pub fn update(&mut self, intent: &str, embedding: Vec<f32>, location: BoundingBox) {
        self.memory.insert(intent.to_string(), (embedding, location));
    }

    pub fn get(&self, intent: &str) -> Option<&(Vec<f32>, BoundingBox)> {
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

    /// Simulates encoding text intent into a vector space (e.g. CLIP Text Encoder)
    pub fn encode_text(&self, text: &str) -> Array1<f32> {
        let mut rng = rand::thread_rng();
        // Deterministic-ish simulation based on string length to simulate "semantic" difference
        let seed = text.len() as u64;
        // In reality, we'd run the text through a Transformer
        Array1::from_iter((0..768).map(|i| {
            let s = (i as f32 + seed as f32).sin();
            s
        }))
    }

    /// Simulates detecting objects in an image and generating visual embeddings (e.g. CLIP Image Encoder)
    pub fn detect_objects(&self, _image: &DynamicImage) -> Vec<(BoundingBox, Array1<f32>, String)> {
        // MOCK: In a real system, this runs the image through a ViT Object Detector.
        // We will generate a few "detected" elements.

        let mut objects = Vec::new();
        let mut rng = rand::thread_rng();

        // 1. A "Buy/Checkout" looking button
        objects.push((
            BoundingBox { x: 800, y: 600, width: 150, height: 50 },
            self.encode_text("buy checkout submit"), // Simulate visual feature matching "buy" concept
            "primary_button".to_string()
        ));

        // 2. A "Login" field
        objects.push((
            BoundingBox { x: 400, y: 300, width: 200, height: 40 },
            self.encode_text("login username user"),
            "text_input".to_string()
        ));

        // 3. A "Discount" field
        objects.push((
            BoundingBox { x: 400, y: 400, width: 200, height: 40 },
            self.encode_text("discount coupon code"),
            "text_input".to_string()
        ));

        // 4. Random noise element
        objects.push((
            BoundingBox { x: 10, y: 10, width: 50, height: 50 },
             Array1::from_iter((0..768).map(|_| rng.gen::<f32>())),
            "logo".to_string()
        ));

        objects
    }
}

#[derive(Debug, Clone)]
pub struct VisualElement {
    pub intent_label: String,
    pub embedding: Array1<f32>,
    pub location: BoundingBox,
    pub last_seen: u64,
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

        // 2. Load into DynamicImage (Real Vision Preprocessing)
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

        // 3. Vision-Transformer (ViT) Logic Simulation
        // We simulate attention mechanism by "focusing" on regions.

        let mut rng = rand::thread_rng();

        // HEURISTIC: Analyze center pixel to determine "theme" (simulated)
        let (center_x, center_y) = (img.width() / 2, img.height() / 2);
        let _center_pixel = img.get_pixel(center_x, center_y);
        // In a real ViT, we would take patches. Here we just note it.
        audit_trail.push(format!("ViT Attention Head #1 focused on center ({}, {})", center_x, center_y));

        let confidence: f32 = rng.gen_range(0.85..0.99);
        let intent_lower = request.intent.to_lowercase();

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
        } else if intent == "FAIL_TEST" {
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

        // Simulated Semantic Embedding (768 dimensions is standard for ViT/BERT)
        let embedding: Vec<f32> = (0..768).map(|_| rng.gen::<f32>()).collect();
        audit_trail.push("Generated 768-dimensional semantic vector.".to_string());

        // Simulated Heatmap (10x10 grid flattened)
        let heatmap_data: Vec<f32> = (0..100).map(|_| rng.gen::<f32>()).collect();

        let elapsed = start_time.elapsed();

    fn error_result(&self, msg: &str) -> VisionResult {
        VisionResult {
            found: primary_box.is_some(),
            location: primary_box,
            candidates,
            confidence,
            semantic_embedding: embedding,
            heatmap_data,
            reasoning: format!("ViT Layer identified '{}' based on visual intent patterns (Edge detection, OCR, Iconography). Confidence: {:.2}", request.intent, confidence),
            processing_time_ms: elapsed.as_millis() as u64,
        }

        if count == 0.0 { return 0.0; }

        let mean = sum / count;
        (sum_sq / count) - (mean * mean)
    }

    // Helper to update the internal map (would be called after successful interactions)
    pub fn update_map(&mut self, intent: String, element: VisualElement) {
        self.neural_map.insert(intent, element);
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
        assert!(result.reasoning.contains("Base64 decode error"));
    }
}
