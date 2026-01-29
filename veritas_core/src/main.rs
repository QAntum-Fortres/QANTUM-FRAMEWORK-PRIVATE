mod engine;
mod enterprise;
mod omega;

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
use enterprise::traffic::{TieredRateLimiter, Tier};
use omega::physics::{SpatialFolder, ZeroPointHarvester};
use omega::psionics::{NoeticLayer, PrescientLattice};
use omega::ontology::RealityAnchor;

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
    Omega(OmegaRequest),
    Ping,
    Chaos(ChaosRequest),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChaosRequest {
    pub kill_count: u32,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type")]
enum OmegaRequest {
    Fold { coords: [f64; 11] },
    InvertEntropy,
    TransmitQualia { concept: String },
    Anticipate { subject_id: String },
    VerifyReality { entity_id: String },
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
    let mut swarm = DistributedSwarm::new();

    // Physics Layer 2: Warm Up
    swarm.pre_warm();

    // Enterprise Modules
    let rbac = RBAC::new();
    let logger = AuditLogger::new();
    let gdpr = GDPRGuard::new();
    let _monitor = ComplianceMonitor::new();

    // Chemistry Layer 3: Rate Limiting
    let mut limiter = TieredRateLimiter::new(100); // Max 100 concurrent requests

    // Omega Modules (Experimental)
    let folder = SpatialFolder::new();
    let harvester = ZeroPointHarvester::new();
    let noetic = NoeticLayer::new();
    let lattice = PrescientLattice::new();
    let anchor = RealityAnchor::new();

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
                    let tier = if secure_cmd.user_id == "admin" {
                        roles.insert(Role::Admin);
                        Tier::Sovereign
                    } else if secure_cmd.user_id == "enterprise" {
                        roles.insert(Role::Agent);
                        Tier::Enterprise
                    } else {
                        roles.insert(Role::Viewer); // Default
                        Tier::Starter
                    };

                    let user_ctx = UserContext {
                        user_id: secure_cmd.user_id.clone(),
                        roles,
                        auth_token: secure_cmd.auth_token,
                    };

                    // 3. Traffic Control (Rate Limiting)
                    limiter.enqueue(secure_cmd.user_id.clone(), tier);
                    if limiter.next().is_none() {
                        print_error("Rate Limit Exceeded: Grid Saturated. Upgrade to Sovereign Tier for priority.");
                        continue;
                    }

                    // 4. Log
                    let _log_entry = logger.log("CommandReceived", &user_ctx);

                    // 5. Authorize & Execute
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
                        Command::Omega(req) => {
                            if rbac.authorize(&user_ctx, Role::Admin) {
                                let result = match req {
                                    OmegaRequest::Fold { coords } => folder.remap(coords),
                                    OmegaRequest::InvertEntropy => harvester.invert_entropy(),
                                    OmegaRequest::TransmitQualia { concept } => noetic.transmit_qualia(&concept),
                                    OmegaRequest::Anticipate { subject_id } => lattice.anticipate(&subject_id),
                                    OmegaRequest::VerifyReality { entity_id } => anchor.verify_existence(&entity_id),
                                };
                                print_response(result);
                            } else { print_error("Access Denied: Omega Clearance Required"); }
                        },
                        Command::Chaos(req) => {
                            // "Apoptosis Protocol" - Killing agents
                            if rbac.authorize(&user_ctx, Role::Admin) {
                                let replenished = swarm.kill_agents(req.kill_count);
                                print_response(format!("Chaos executed: {} agents terminated. {} agents replenished via Progressive Warming.", req.kill_count, replenished));
                            } else { print_error("Access Denied: Chaos Clearance Required"); }
                        },
                        Command::Ping => {
                             print_response("Pong".to_string());
                        }
                    }

                    // Release slot
                    limiter.release();
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
