mod engine;

use std::io::{self, BufRead};
use serde::{Deserialize, Serialize};
use engine::neural_locator::{NeuralLocator, VisionRequest};
use engine::semantic_healer::{SemanticHealer, HealRequest};
use engine::agent::{GoalOrientedAgent, GoalRequest};
use engine::observer::{StateChangeObserver, ObserverRequest};
use engine::swarm::{DistributedSwarm, SwarmRequest};

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "command", content = "payload")]
enum Command {
    Locate(VisionRequest),
    Heal(HealRequest),
    Goal(GoalRequest),
    Observe(ObserverRequest),
    Swarm(SwarmRequest),
    Ping,
}

#[derive(Serialize, Deserialize, Debug)]
struct Response<T> {
    status: String,
    data: Option<T>,
    error: Option<String>,
}

fn main() {
    let locator = NeuralLocator::new();
    let healer = SemanticHealer::new();
    let agent = GoalOrientedAgent::new();
    let observer = StateChangeObserver::new();
    let swarm = DistributedSwarm::new();

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
                            print_response(result);
                        },
                        Command::Heal(req) => {
                            let result = healer.heal(&req);
                            print_response(result);
                        },
                         Command::Goal(req) => {
                            let result = agent.execute(&req);
                            print_response(result);
                        },
                        Command::Observe(req) => {
                            let result = observer.observe(&req);
                            print_response(result);
                        },
                         Command::Swarm(req) => {
                            let result = swarm.launch(&req);
                            print_response(result);
                        },
                        Command::Ping => {
                             print_response("Pong".to_string());
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

fn print_response<T: Serialize>(data: T) {
    let response = Response {
        status: "success".to_string(),
        data: Some(data),
        error: None,
    };
    println!("{}", serde_json::to_string(&response).unwrap());
}
