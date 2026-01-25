// Economy Server - HTTP API for Economic Metrics
// Provides REST API endpoints for real-time economic data

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use lwas_economy::{EconomyEngine, Transaction, TransactionType};
use serde_json::json;
use std::sync::Mutex;
use std::collections::HashMap;

struct AppState {
    engine: Mutex<EconomyEngine>,
}

async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(json!({
        "status": "healthy",
        "service": "lwas_economy",
        "version": "1.0.0"
    }))
}

async fn get_metrics(data: web::Data<AppState>) -> impl Responder {
    let engine = data.engine.lock().unwrap();
    let metrics = engine.get_metrics();
    HttpResponse::Ok().json(metrics)
}

async fn get_equity(data: web::Data<AppState>) -> impl Responder {
    let engine = data.engine.lock().unwrap();
    let equity = engine.get_equity_report();
    HttpResponse::Ok().json(json!({
        "total_equity": equity,
        "currency": "USD"
    }))
}

async fn get_profitability(data: web::Data<AppState>) -> impl Responder {
    let engine = data.engine.lock().unwrap();
    let profit = engine.get_profitability_report();
    HttpResponse::Ok().json(json!({
        "current_profitability": profit,
        "currency": "USD"
    }))
}

async fn record_transaction(
    data: web::Data<AppState>,
    tx: web::Json<Transaction>,
) -> impl Responder {
    let mut engine = data.engine.lock().unwrap();
    engine.record_transaction(tx.into_inner());
    HttpResponse::Created().json(json!({
        "status": "recorded",
        "message": "Transaction processed successfully"
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 LwaS Economy Server Starting...");
    println!("📊 Real-time Equity & Profitability Calculation Engine");
    println!("🌐 Server will listen on http://127.0.0.1:8891");

    let app_state = web::Data::new(AppState {
        engine: Mutex::new(EconomyEngine::new()),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .route("/health", web::get().to(health_check))
            .route("/metrics", web::get().to(get_metrics))
            .route("/equity", web::get().to(get_equity))
            .route("/profitability", web::get().to(get_profitability))
            .route("/transaction", web::post().to(record_transaction))
    })
    .bind(("127.0.0.1", 8891))?
    .run()
    .await
}
