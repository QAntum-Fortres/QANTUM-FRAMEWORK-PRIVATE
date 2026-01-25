mod exchange;
mod fortress;
mod gateway;
mod types;

use axum::{
    response::Html,
    routing::{get, post},
    Json, Router,
};
use gateway::PaymentGateway;
use rust_decimal_macros::dec;
use serde_json::json;
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::{cors::CorsLayer, services::ServeDir};
use types::{Transaction, TransactionStatus};

struct AppState {
    gateway: PaymentGateway,
    start_time: chrono::DateTime<chrono::Utc>,
}

#[tokio::main]
async fn main() {
    println!(
        r#"
    ╔════════════════════════════════════════════╗
    ║  🌌 QANTUM AETERNA CORE - RUST SUBSTRATE   ║
    ║  "Стоманеното ядро е активно"              ║
    ║  Status: UNIFIED | Entropy: ZERO           ║
    ╚════════════════════════════════════════════╝
    "#
    );

    let state = Arc::new(AppState {
        gateway: PaymentGateway::new(),
        start_time: chrono::Utc::now(),
    });

    // 1. Define Routes
    let app = Router::new()
        // --- Core Status ---
        .route("/api/status", get(status_handler))
        // --- Economy Endpoints ---
        .route("/api/economy/pay", post(payment_handler))
        .route("/api/economy/stats", get(stats_handler))
        // --- Static Files (Dashboard) ---
        // Pointing to the existing dashboard directory
        .fallback_service(ServeDir::new(
            r"C:\Users\papic\Desktop\STORY-ENDERR\QANTUM-JULES\OmniCore\dashboard",
        ))
        .layer(CorsLayer::permissive())
        .with_state(state);

    // 2. Start Server
    let addr = SocketAddr::from(([0, 0, 0, 0], 8890));
    println!("[SERVER] Listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// --- HANDLERS ---

async fn status_handler() -> Json<serde_json::Value> {
    Json(json!({
        "status": "OPERATIONAL",
        "substrate": "RUST_AXUM",
        "version": "3.0.0-SINGULARITY",
        "integrity": "VERITAS_VALIDATED"
    }))
}

async fn payment_handler(
    axum::extract::State(state): axum::extract::State<Arc<AppState>>,
    Json(payload): Json<serde_json::Value>,
) -> Json<Transaction> {
    let amount = payload["amount"].as_f64().unwrap_or(0.0);
    let provider = payload["provider"].as_str().unwrap_or("stripe");

    // Convert to Decimal for deterministic math
    let dec_amount = rust_decimal::Decimal::from_f64_retain(amount).unwrap_or(dec!(0));

    let tx = state
        .gateway
        .create_charge(dec_amount, "eur", provider)
        .unwrap();
    let confirmed_tx = state.gateway.confirm_charge(tx);

    Json(confirmed_tx)
}

async fn stats_handler(
    axum::extract::State(state): axum::extract::State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    let uptime = chrono::Utc::now() - state.start_time;

    Json(json!({
        "total_revenue": 0.0, // Awaiting real ingestion
        "uptime_seconds": uptime.num_seconds(),
        "active_nodes": 1,
        "cashflow_bridge": "READY"
    }))
}
