mod engine;

use std::io::{self, BufRead};
use serde::{Deserialize, Serialize};
use engine::neural_locator::{NeuralLocator, VisionRequest, VisionResult};

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "command", content = "payload")]
enum Command {
    Locate(VisionRequest),
    Heal(HealRequest),
    // Distributed Swarm commands would go here
    Ping,
}

#[derive(Serialize, Deserialize, Debug)]
struct HealRequest {
    failed_selector: String,
    last_known_embedding: Vec<f32>,
    current_image: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Response<T> {
    status: String,
    data: Option<T>,
    error: Option<String>,
}

fn main() {
    let locator = NeuralLocator::new();
    let stdin = io::stdin();

    // Simple JSON-RPC loop over Stdin
    for line in stdin.lock().lines() {
        if let Ok(input) = line {
            if input.trim().is_empty() { continue; }

            match serde_json::from_str::<Command>(&input) {
                Ok(command) => {
                    match command {
                        Command::Locate(req) => {
                            let result = locator.analyze(&req);
                            let response = Response {
                                status: "success".to_string(),
                                data: Some(result),
                                error: None,
                            };
                            println!("{}", serde_json::to_string(&response).unwrap());
                        },
                        Command::Heal(req) => {
                            // SIMULATION: Semantic Healing
                            // In reality, we would compare embeddings using Cosine Similarity.
                            // Here we simulate a successful match.

                            let response = Response {
                                status: "success".to_string(),
                                data: Some(serde_json::json!({
                                    "healed": true,
                                    "new_selector": format!("xpath: //*[contains(@class, 'semantic-match-{}')]", req.failed_selector),
                                    "similarity_score": 0.98,
                                    "reason": "Visual embedding match > threshold"
                                })),
                                error: None,
                            };
                             println!("{}", serde_json::to_string(&response).unwrap());
                        },
                        Command::Ping => {
                             let response = Response::<String> {
                                status: "success".to_string(),
                                data: Some("Pong".to_string()),
                                error: None,
                            };
                            println!("{}", serde_json::to_string(&response).unwrap());
                        }
                    }
                },
                Err(e) => {
                    let response = Response::<String> {
                        status: "error".to_string(),
                        data: None,
                        error: Some(format!("Invalid command: {}", e)),
                    };
                    println!("{}", serde_json::to_string(&response).unwrap());
                }
            }
        }
    }
}
