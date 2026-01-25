// Telemetry Reporter Server - HTTP API for System Monitoring
// The Eye of Sauron - Watches everything, reports to Dashboard

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use lwas_telemetry_reporter::{TelemetryReporter, MarketTelemetry};
use serde_json::json;
use std::sync::Mutex;

struct AppState {
    reporter: Mutex<TelemetryReporter>,
}

async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(json!({
        "status": "watching",
        "service": "lwas_telemetry_reporter",
        "version": "1.0.0",
        "description": "The Eye of Sauron - Nothing escapes our sight"
    }))
}

async fn get_system_telemetry(data: web::Data<AppState>) -> impl Responder {
    let mut reporter = data.reporter.lock().unwrap();
    let telemetry = reporter.collect_system_telemetry();
    HttpResponse::Ok().json(telemetry)
}

async fn get_full_report(data: web::Data<AppState>) -> impl Responder {
    let mut reporter = data.reporter.lock().unwrap();
    let report = reporter.generate_report();
    HttpResponse::Ok().json(report)
}

async fn get_alerts(data: web::Data<AppState>) -> impl Responder {
    let reporter = data.reporter.lock().unwrap();
    let alerts = reporter.get_alerts();
    HttpResponse::Ok().json(alerts)
}

async fn record_market_data(
    data: web::Data<AppState>,
    market: web::Json<MarketTelemetry>,
) -> impl Responder {
    let mut reporter = data.reporter.lock().unwrap();
    reporter.record_market_data(market.into_inner());
    HttpResponse::Created().json(json!({
        "status": "recorded",
        "message": "Market data recorded successfully"
    }))
}

async fn clear_alerts(data: web::Data<AppState>) -> impl Responder {
    let mut reporter = data.reporter.lock().unwrap();
    reporter.clear_alerts();
    HttpResponse::Ok().json(json!({
        "status": "cleared",
        "message": "All alerts cleared"
    }))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("👁️  LwaS Telemetry Reporter - The Eye of Sauron");
    println!("📡 Real-time System & Market Monitoring");
    println!("🌐 Server will listen on http://127.0.0.1:8890");
    println!("🔍 Watching everything... reporting to Dashboard...");

    let app_state = web::Data::new(AppState {
        reporter: Mutex::new(TelemetryReporter::new()),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(app_state.clone())
            .route("/health", web::get().to(health_check))
            .route("/system", web::get().to(get_system_telemetry))
            .route("/report", web::get().to(get_full_report))
            .route("/alerts", web::get().to(get_alerts))
            .route("/alerts/clear", web::post().to(clear_alerts))
            .route("/market", web::post().to(record_market_data))
    })
    .bind(("127.0.0.1", 8890))?
    .run()
    .await
}
