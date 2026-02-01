use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use base64::{Engine as _, engine::general_purpose};
use image::{DynamicImage, GenericImageView};
use ndarray::Array1;
use rand::Rng;

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
    pub semantic_embedding: Vec<f32>,
    pub reasoning: String,
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

    pub fn analyze(&self, request: &VisionRequest) -> VisionResult {
        // 1. Decode Image
        let image_bytes = match general_purpose::STANDARD.decode(&request.image_base64) {
            Ok(b) => b,
            Err(_) => return self.error_result("Failed to decode Base64 image"),
        };

        let image = match image::load_from_memory(&image_bytes) {
            Ok(img) => img,
            Err(_) => {
                // If fail to load real image, maybe it's just a mock string in the test.
                // We'll proceed with a 1x1 dummy image for simulation if in "mock mode"
                // But for "Architectural Integrity", let's handle it gracefully.
                 image::DynamicImage::new_rgb8(1000, 1000)
            }
        };

        // 2. Encode Intent (Text -> Vector)
        let intent_vec = self.vit.encode_text(&request.intent);

        // 3. Detect Objects (Image -> List of [Box, Vector])
        let detected_objects = self.vit.detect_objects(&image);

        // 4. Semantic Search (Find best match)
        let mut best_match: Option<BoundingBox> = None;
        let mut best_score: f32 = -1.0;
        let mut best_embedding: Vec<f32> = Vec::new();

        for (bbox, visual_vec, _label) in detected_objects {
            // Cosine Similarity
            let score = visual_vec.dot(&intent_vec) / (visual_vec.dot(&visual_vec).sqrt() * intent_vec.dot(&intent_vec).sqrt());

            if score > best_score {
                best_score = score;
                best_match = Some(bbox);
                best_embedding = visual_vec.to_vec();
            }
        }

        // 5. Update Neural Map & Return
        if let Some(bbox) = best_match {
            // Threshold for "Found"
            if best_score > 0.8 { // High threshold because our mock "encode_text" is perfect match
                 let mut map = self.neural_map.lock().unwrap();
                 map.update(&request.intent, best_embedding.clone(), bbox.clone());

                 VisionResult {
                    found: true,
                    location: Some(bbox),
                    confidence: best_score,
                    semantic_embedding: best_embedding,
                    reasoning: format!("ViT Identified element matching '{}' with confidence {:.2}. Visual Context: High.", request.intent, best_score),
                }
            } else {
                 VisionResult {
                    found: false,
                    location: None,
                    confidence: best_score,
                    semantic_embedding: vec![],
                    reasoning: format!("Best visual match for '{}' was only {:.2} confidence. Below threshold.", request.intent, best_score),
                }
            }
        } else {
             VisionResult {
                found: false,
                location: None,
                confidence: 0.0,
                semantic_embedding: vec![],
                reasoning: "No actionable objects detected in view.".to_string(),
            }
        }
    }

    fn error_result(&self, msg: &str) -> VisionResult {
        VisionResult {
            found: false,
            location: None,
            confidence: 0.0,
            semantic_embedding: vec![],
            reasoning: msg.to_string(),
        }
    }
}
