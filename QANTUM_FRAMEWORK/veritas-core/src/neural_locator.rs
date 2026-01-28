use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BoundingBox {
    pub x: f32,
    pub y: f32,
    pub width: f32,
    pub height: f32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UIElement {
    pub id: String,
    pub element_type: String,
    pub bbox: BoundingBox,
    pub confidence: f32,
    pub semantic_embedding: Vec<f32>,
}

pub struct NeuralLocator {
    model_path: String,
    neural_map: Vec<UIElement>,
}

impl NeuralLocator {
    pub fn new(model_path: &str) -> Self {
        NeuralLocator {
            model_path: model_path.to_string(),
            neural_map: Vec::new(),
        }
    }

    pub fn locate_elements(&self, _screenshot_path: &str) -> Vec<UIElement> {
        vec![
            UIElement {
                id: "btn-buy".to_string(),
                element_type: "button".to_string(),
                bbox: BoundingBox { x: 100.0, y: 200.0, width: 100.0, height: 40.0 },
                confidence: 0.99,
                semantic_embedding: vec![0.1, 0.2, 0.3],
            },
            UIElement {
                id: "input-coupon".to_string(),
                element_type: "input".to_string(),
                bbox: BoundingBox { x: 100.0, y: 300.0, width: 200.0, height: 30.0 },
                confidence: 0.95,
                semantic_embedding: vec![0.4, 0.5, 0.6],
            }
        ]
    }
}
