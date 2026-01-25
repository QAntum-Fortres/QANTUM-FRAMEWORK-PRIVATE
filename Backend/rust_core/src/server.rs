use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use std::sync::{Arc, Mutex};

use crate::economy::EconomyEngine;
use crate::telemetry::TelemetryEngine;

#[derive(Debug, Deserialize)]
struct MintCreditsRequest {
    user_id: String,
    amount: f64,
}

#[derive(Debug, Deserialize)]
struct UnlockModuleRequest {
    user_id: String,
    module_name: String,
    cost: f64,
}

#[derive(Debug, Deserialize)]
struct GetBalanceRequest {
    user_id: String,
}

struct AppState {
    economy: Arc<EconomyEngine>,
    telemetry: Arc<Mutex<TelemetryEngine>>,
}

async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "healthy",
        "service": "lwas_economy"
    }))
}

async fn mint_credits(
    data: web::Json<MintCreditsRequest>,
    state: web::Data<AppState>,
) -> impl Responder {
    match state.economy.mint_credits(data.user_id.clone(), data.amount) {
        Ok(balance) => HttpResponse::Ok().json(balance),
        Err(e) => HttpResponse::BadRequest().json(serde_json::json!({
            "error": e
        })),
    }
}

async fn unlock_module(
    data: web::Json<UnlockModuleRequest>,
    state: web::Data<AppState>,
) -> impl Responder {
    match state.economy.unlock_module(
        data.user_id.clone(),
        data.module_name.clone(),
        data.cost,
    ) {
        Ok(balance) => HttpResponse::Ok().json(balance),
        Err(e) => HttpResponse::BadRequest().json(serde_json::json!({
            "error": e
        })),
    }
}

async fn get_balance(
    query: web::Query<GetBalanceRequest>,
    state: web::Data<AppState>,
) -> impl Responder {
    match state.economy.get_balance(&query.user_id) {
        Some(balance) => HttpResponse::Ok().json(balance),
        None => HttpResponse::NotFound().json(serde_json::json!({
            "error": "User not found"
        })),
    }
}

async fn get_telemetry(state: web::Data<AppState>) -> impl Responder {
    let transaction_count = state.economy.get_transaction_count();
    let mut telemetry = state.telemetry.lock().unwrap();
    let metrics = telemetry.get_metrics(transaction_count);
    HttpResponse::Ok().json(metrics)
}

async fn list_balances(state: web::Data<AppState>) -> impl Responder {
    let balances = state.economy.get_all_balances();
    HttpResponse::Ok().json(balances)
}

pub async fn run_server() -> std::io::Result<()> {
    let economy = Arc::new(EconomyEngine::new());
    let telemetry = Arc::new(Mutex::new(TelemetryEngine::new()));

    let app_state = web::Data::new(AppState {
        economy,
        telemetry,
    });

    println!("🚀 LWAS Economy Server starting on http://0.0.0.0:8890");

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .route("/health", web::get().to(health_check))
            .route("/api/mint_credits", web::post().to(mint_credits))
            .route("/api/unlock_module", web::post().to(unlock_module))
            .route("/api/balance", web::get().to(get_balance))
            .route("/api/telemetry", web::get().to(get_telemetry))
            .route("/api/balances", web::get().to(list_balances))
    })
    .bind("0.0.0.0:8890")?
    .run()
    .await
}
