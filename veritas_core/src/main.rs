mod engine;
mod enterprise;

use std::io::{self, BufRead};
use std::collections::HashSet;
use serde::{Deserialize, Serialize};
use engine::neural_locator::{NeuralLocator, VisionRequest};
use engine::semantic_healer::{SemanticHealer, HealRequest};
use engine::agent::{GoalOrientedAgent, GoalRequest};
use engine::observer::{StateChangeObserver, ObserverRequest};
use engine::swarm::{DistributedSwarm, SwarmRequest};
use enterprise::security::{RBAC, AuditLogger, UserContext, Role};
use enterprise::compliance::{GDPRGuard, ComplianceMonitor};

#[derive(Serialize, Deserialize, Debug)]
struct SecureCommand {
    auth_token: String,
    user_id: String,
    command: Command,
}

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

    // Enterprise Modules
    let rbac = RBAC::new();
    let logger = AuditLogger::new();
    let gdpr = GDPRGuard::new();
    let _monitor = ComplianceMonitor::new();

    let stdin = io::stdin();

    // Simple JSON-RPC loop over Stdin
    for line in stdin.lock().lines() {
        if let Ok(input) = line {
            if input.trim().is_empty() { continue; }

            // Parse as SecureCommand
            match serde_json::from_str::<SecureCommand>(&input) {
                Ok(secure_cmd) => {
                    // 1. Authenticate (Mock)
                    if secure_cmd.auth_token != "valid_token" {
                        print_error("Authentication failed: Invalid token");
                        continue;
                    }

                    // 2. Build Context
                    let mut roles = HashSet::new();
                    if secure_cmd.user_id == "admin" {
                        roles.insert(Role::Admin);
                    } else {
                        roles.insert(Role::Viewer); // Default
                    }

                    let user_ctx = UserContext {
                        user_id: secure_cmd.user_id,
                        roles,
                        auth_token: secure_cmd.auth_token,
                    };

                    // 3. Log
                    let _log_entry = logger.log("CommandReceived", &user_ctx);

                    // 4. Authorize & Execute
                    match secure_cmd.command {
                        Command::Locate(req) => {
                             if rbac.authorize(&user_ctx, Role::Viewer) {
                                let result = locator.analyze(&req);
                                print_response(result);
                             } else { print_error("Access Denied"); }
                        },
                        Command::Heal(req) => {
                             if rbac.authorize(&user_ctx, Role::Agent) {
                                let result = healer.heal(&req);
                                print_response(result);
                             } else { print_error("Access Denied"); }
                        },
                         Command::Goal(req) => {
                             if rbac.authorize(&user_ctx, Role::Agent) {
                                // Sanitize Goal Input
                                let safe_goal = gdpr.sanitize(&req.goal);
                                let result = agent.execute(&GoalRequest{ goal: safe_goal });
                                print_response(result);
                             } else { print_error("Access Denied"); }
                        },
                        Command::Observe(req) => {
                            if rbac.authorize(&user_ctx, Role::Viewer) {
                                let result = observer.observe(&req);
                                print_response(result);
                             } else { print_error("Access Denied"); }
                        },
                         Command::Swarm(req) => {
                             if rbac.authorize(&user_ctx, Role::Admin) {
                                let result = swarm.launch(&req);
                                print_response(result);
                             } else { print_error("Access Denied: Admin only"); }
                        },
                        Command::Ping => {
                             print_response("Pong".to_string());
                        }
                    }
                },
                Err(e) => {
                    // Fallback to non-secure command for backward compatibility or error
                     print_error(&format!("Invalid Secure Command format: {}", e));
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

fn print_error(msg: &str) {
     let response = Response::<String> {
        status: "error".to_string(),
        data: None,
        error: Some(msg.to_string()),
    };
    println!("{}", serde_json::to_string(&response).unwrap());
}
