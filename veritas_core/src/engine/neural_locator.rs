use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use base64::{Engine as _, engine::general_purpose};
use image::{DynamicImage, GenericImageView, ImageFormat};
use std::time::{SystemTime, UNIX_EPOCH, Instant};
use rand::Rng;

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

    pub fn update(&mut self, intent: String, entry: NeuralMapEntry) {
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

    /// Simulates encoding text intent into a vector space (e.g. CLIP Text Encoder)
    pub fn encode_text(&self, text: &str) -> Vec<f32> {
        let seed = text.len() as u64;
        (0..768).map(|i| {
            (i as f32 + seed as f32).sin()
        }).collect()
    }

    /// Analyzes the image to detect potential UI elements based on pixel variance and edge density.
    pub fn detect_ui_elements(&self, img: &DynamicImage) -> Vec<BoundingBox> {
        let gray_img = img.to_luma8();
        let (width, height) = gray_img.dimensions();
        let block_size = 20;
        let grid_w = (width + block_size - 1) / block_size;
        let grid_h = (height + block_size - 1) / block_size;

        let mut active_grid = vec![vec![false; grid_w as usize]; grid_h as usize];

        // 1. Identify "Active" blocks (high variance)
        for gy in 0..grid_h {
            for gx in 0..grid_w {
                let x_start = gx * block_size;
                let y_start = gy * block_size;
                let x_end = (x_start + block_size).min(width);
                let y_end = (y_start + block_size).min(height);

                let mut sum = 0.0;
                let mut sum_sq = 0.0;
                let mut count = 0.0;

                for y in y_start..y_end {
                    for x in x_start..x_end {
                        let p = gray_img.get_pixel(x, y)[0] as f32;
                        sum += p;
                        sum_sq += p * p;
                        count += 1.0;
                    }
                }

                if count > 0.0 {
                    let mean = sum / count;
                    let variance = (sum_sq / count) - (mean * mean);

                    // Threshold for "interesting" content (text, buttons, etc have variance)
                    // Solid background has 0 variance.
                    if variance > 50.0 {
                        active_grid[gy as usize][gx as usize] = true;
                    }
                }
            }
        }

        // 2. Connected Components to merge blocks into Bounding Boxes
        let mut visited = vec![vec![false; grid_w as usize]; grid_h as usize];
        let mut boxes = Vec::new();

        for gy in 0..grid_h {
            for gx in 0..grid_w {
                if active_grid[gy as usize][gx as usize] && !visited[gy as usize][gx as usize] {
                    // Start a new component
                    let mut min_gx = gx;
                    let mut max_gx = gx;
                    let mut min_gy = gy;
                    let mut max_gy = gy;
                    let mut component_stack = vec![(gx, gy)];
                    visited[gy as usize][gx as usize] = true;

                    while let Some((cx, cy)) = component_stack.pop() {
                        if cx < min_gx { min_gx = cx; }
                        if cx > max_gx { max_gx = cx; }
                        if cy < min_gy { min_gy = cy; }
                        if cy > max_gy { max_gy = cy; }

                        // Check neighbors
                        let neighbors = [
                            (cx.wrapping_sub(1), cy), (cx + 1, cy),
                            (cx, cy.wrapping_sub(1)), (cx, cy + 1)
                        ];

                        for (nx, ny) in neighbors {
                            if nx < grid_w && ny < grid_h {
                                if active_grid[ny as usize][nx as usize] && !visited[ny as usize][nx as usize] {
                                    visited[ny as usize][nx as usize] = true;
                                    component_stack.push((nx, ny));
                                }
                            }
                        }
                    }

                    // Convert grid coords to pixel coords
                    let x = min_gx * block_size;
                    let y = min_gy * block_size;
                    let w = (max_gx - min_gx + 1) * block_size;
                    let h = (max_gy - min_gy + 1) * block_size;

                    // Filter out very small noise
                    if w > 20 && h > 10 {
                        boxes.push(BoundingBox {
                            x: x as i32,
                            y: y as i32,
                            width: w as i32,
                            height: h as i32,
                            label: None, // To be classified
                            confidence: 0.8, // Base confidence for visual detection
                        });
                    }
                }
            }
        }

        boxes
    }

    /// Classifies a bounding box based on its shape and position.
    pub fn heuristic_classify(&self, box_data: &BoundingBox, img_width: u32, img_height: u32) -> String {
        let ar = box_data.width as f32 / box_data.height as f32;
        let relative_w = box_data.width as f32 / img_width as f32;
        // let relative_h = box_data.height as f32 / img_height as f32;

        let center_x = box_data.x + box_data.width / 2;
        let center_y = box_data.y + box_data.height / 2;

        // Position Heuristics
        let is_top_right = center_x > (img_width as i32 - 200) && center_y < 100;
        if is_top_right {
            if ar < 1.5 { return "Icon_Profile".to_string(); }
            return "Button_Nav".to_string();
        }

        if relative_w > 0.8 {
            return "Container_Section".to_string();
        }

        if ar > 4.0 {
            // Very wide -> likely Input field or Banner text
            return "Input_Field".to_string();
        } else if ar > 1.2 {
            // Wide -> likely Button
            return "Button".to_string();
        } else if ar < 0.5 {
             // Tall -> likely Sidebar item
             return "Sidebar_Item".to_string();
        } else {
            // Square-ish
            if relative_w < 0.1 {
                return "Icon".to_string();
            }
            return "Image".to_string();
        }
    }
}

pub struct NeuralLocator {
    pub vit: VisionTransformer, // Made public for SemanticHealer access
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
        let start_time = Instant::now();
        // eprintln!("[NeuralLocator] Analyzing image for intent: '{}'", request.intent);

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

        let img = match image::load_from_memory(&image_data) {
             Ok(img) => img,
             Err(_) => {
                 match image::load_from_memory_with_format(&image_data, ImageFormat::Png) {
                     Ok(img) => img,
                     Err(_) => {
                         // Create a dummy image if loading fails, just to not crash, or return error
                         return VisionResult {
                            found: false,
                            location: None,
                            candidates: vec![],
                            confidence: 0.0,
                            semantic_embedding: vec![],
                            heatmap_data: vec![],
                            reasoning: "Failed to load image from data.".to_string(),
                            processing_time_ms: 0,
                        };
                     }
                 }
             }
        };

        let (width, height) = img.dimensions();
        let mut candidates = self.vit.detect_ui_elements(&img);
        let mut best_match: Option<BoundingBox> = None;
        let mut max_confidence = 0.0;
        let mut reasoning = String::new();

        let intent_lower = request.intent.to_lowercase();

        // Check Neural Map for existing memory of this intent
        let memory_location = {
            let map = self.neural_map.lock().unwrap();
            map.get(&request.intent).map(|e| e.location.clone())
        };

        // Match Intent to Visual Elements
        for box_data in &mut candidates {
            let label = self.vit.heuristic_classify(box_data, width, height);
            box_data.label = Some(label.clone());

            // Simple Keyword Matching logic
            let mut score: f32 = 0.0;

            if intent_lower.contains("button") && label.contains("Button") { score += 0.8; }
            if intent_lower.contains("login") && (label.contains("Button") || label.contains("Input")) { score += 0.6; }
            if intent_lower.contains("checkout") && label.contains("Button") { score += 0.7; }
            if intent_lower.contains("input") && label.contains("Input") { score += 0.9; }
            if intent_lower.contains("profile") && label.contains("Profile") { score += 0.9; }
            if intent_lower.contains("image") && label.contains("Image") { score += 0.9; }
            if intent_lower.contains("section") && label.contains("Section") { score += 0.8; }

            // Boost score if the intent explicitly mentions the label
            if intent_lower.contains(&label.to_lowercase()) { score += 0.5; }

            // Neural Map Boost: If close to last known location, boost confidence
            if let Some(ref mem_loc) = memory_location {
                let dist = (box_data.x - mem_loc.x).abs() + (box_data.y - mem_loc.y).abs();
                if dist < 50 {
                    score += 0.3;
                }
            }

            // Update box confidence based on match
            box_data.confidence = score.min(1.0);

            if score > max_confidence {
                max_confidence = score;
                best_match = Some(box_data.clone());
            }
        }

        // Mock embedding and heatmap
        let embedding: Vec<f32> = (0..768).map(|_| rand::thread_rng().gen::<f32>()).collect();

        if let Some(ref m) = best_match {
            reasoning = format!("Found element '{}' matching intent '{}' with confidence {:.2}", m.label.as_ref().unwrap(), request.intent, max_confidence);

            // Update Neural Map Memory if confidence is high
            if max_confidence > 0.8 {
                self.update_map(request.intent.clone(), m.clone(), embedding.clone());
            }
        } else {
             reasoning = format!("No elements found matching intent '{}'. Detected {} candidates.", request.intent, candidates.len());
        }
        let heatmap_data: Vec<f32> = vec![];

        let elapsed = start_time.elapsed();
        VisionResult {
            found: best_match.is_some() && max_confidence > 0.5,
            location: best_match,
            candidates,
            confidence: max_confidence,
            semantic_embedding: embedding,
            heatmap_data,
            reasoning,
            processing_time_ms: elapsed.as_millis() as u64,
        }
    }

    pub fn update_map(&self, intent: String, location: BoundingBox, embedding: Vec<f32>) {
         let mut map_lock = self.neural_map.lock().unwrap();
         map_lock.update(intent, NeuralMapEntry {
            location,
            embedding,
            last_seen: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
        });
    }
}
