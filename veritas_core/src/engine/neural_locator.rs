use serde::{Deserialize, Serialize};
use rand::Rng;
use image::GenericImageView;
use ndarray::Array3;
use base64::{Engine as _, engine::general_purpose};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq)]
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

pub struct NeuralLocator {
    // In a real implementation, this would hold the loaded ONNX/PyTorch model
    #[allow(dead_code)]
    model_loaded: bool,
}

impl NeuralLocator {
    pub fn new() -> Self {
        NeuralLocator {
            model_loaded: true,
        }
    }

    /// Simulates the full Vision Transformer pipeline:
    /// 1. Preprocessing (Base64 -> Image -> Tensor)
    /// 2. Inference (Tensor -> Embeddings + BBox)
    /// 3. Post-processing (Formatting)
    pub fn analyze(&self, request: &VisionRequest) -> VisionResult {
        // 1. Preprocessing
        let _tensor = match self.preprocess(&request.image_base64) {
            Ok(t) => t,
            Err(e) => return VisionResult {
                found: false,
                location: None,
                confidence: 0.0,
                semantic_embedding: vec![],
                reasoning: format!("Preprocessing failed: {}", e),
            },
        };

        // 2. Inference (Simulated)
        // In reality: let output = self.model.run(_tensor);
        let (location, confidence, embedding) = self.simulate_inference(&request.intent);

        // 3. Post-processing
        VisionResult {
            found: location.is_some(),
            location,
            confidence,
            semantic_embedding: embedding,
            reasoning: format!("ViT Layer identified '{}' based on visual intent patterns. Confidence: {:.2}", request.intent, confidence),
        }
    }

    fn preprocess(&self, base64_img: &str) -> Result<Array3<f32>, String> {
        // Decode Base64
        let bytes = general_purpose::STANDARD
            .decode(base64_img)
            .map_err(|e| format!("Base64 decode error: {}", e))?;

        // Load Image
        let img = image::load_from_memory(&bytes)
            .map_err(|e| format!("Image load error: {}", e))?;

        // Resize to ViT standard (e.g., 224x224)
        let resized = img.resize_exact(224, 224, image::imageops::FilterType::Nearest);

        // Convert to Tensor (CHW or HWC) - Simulated here
        let (width, height) = resized.dimensions();
        let mut array = Array3::<f32>::zeros((3, height as usize, width as usize));

        for (x, y, pixel) in resized.pixels() {
            let rgba = pixel.0;
            // Normalize 0.0 - 1.0
            array[[0, y as usize, x as usize]] = rgba[0] as f32 / 255.0;
            array[[1, y as usize, x as usize]] = rgba[1] as f32 / 255.0;
            array[[2, y as usize, x as usize]] = rgba[2] as f32 / 255.0;
        }

        Ok(array)
    }

    fn simulate_inference(&self, intent: &str) -> (Option<BoundingBox>, f32, Vec<f32>) {
        let mut rng = rand::thread_rng();
        let confidence: f32 = rng.gen_range(0.85..0.99);

        // Mock logic to return deterministic results for testing if needed,
        // or just realistic random ones based on "intent".
        let location = if intent.to_lowercase().contains("buy") || intent.to_lowercase().contains("checkout") {
            Some(BoundingBox {
                x: 1024 - 200,
                y: 768 - 100,
                width: 150,
                height: 50,
            })
        } else if intent.to_lowercase().contains("login") {
            Some(BoundingBox {
                x: 800,
                y: 50,
                width: 80,
                height: 30,
            })
        } else if intent.to_lowercase().contains("discount") {
             Some(BoundingBox {
                x: 400,
                y: 500,
                width: 200,
                height: 40,
            })
        } else if intent == "FAIL_TEST" {
            None
        } else {
            // Random location for other elements
            Some(BoundingBox {
                x: rng.gen_range(0..1024),
                y: rng.gen_range(0..768),
                width: 100,
                height: 40,
            })
        };

        // Simulated Semantic Embedding (768 dimensions is standard for ViT/BERT)
        let embedding: Vec<f32> = (0..768).map(|_| rng.gen::<f32>()).collect();

        (location, confidence, embedding)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use image::{Rgba, RgbaImage};
    use std::io::Cursor;

    fn create_dummy_image_base64() -> String {
        let mut img = RgbaImage::new(100, 100);
        for x in 0..100 {
            for y in 0..100 {
                img.put_pixel(x, y, Rgba([255, 0, 0, 255]));
            }
        }
        let mut bytes: Vec<u8> = Vec::new();
        img.write_to(&mut Cursor::new(&mut bytes), image::ImageOutputFormat::Png).unwrap();
        general_purpose::STANDARD.encode(&bytes)
    }

    #[test]
    fn test_analyze_buy_intent() {
        let locator = NeuralLocator::new();
        let base64_img = create_dummy_image_base64();
        let request = VisionRequest {
            image_base64: base64_img,
            intent: "Find the Buy button".to_string(),
        };

        let result = locator.analyze(&request);

        assert!(result.found);
        assert!(result.location.is_some());
        assert!(result.semantic_embedding.len() == 768);
        assert!(result.confidence > 0.0);
    }

    #[test]
    fn test_analyze_login_intent() {
        let locator = NeuralLocator::new();
        let base64_img = create_dummy_image_base64();
        let request = VisionRequest {
            image_base64: base64_img,
            intent: "Login form".to_string(),
        };

        let result = locator.analyze(&request);

        assert!(result.found);
        if let Some(bbox) = result.location {
            assert_eq!(bbox.x, 800); // Check mock logic
        }
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
