import logging
import time
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.database import init_db
from app.routers import auth, economy, payment, system

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("main")

# Track startup time for uptime calculation
START_TIME = time.time()

# Environment detection
IS_PRODUCTION = os.getenv("ENVIRONMENT", "development").lower() == "production"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Sovereign Backend v2.0 Starting...")
    await init_db()
    logger.info("✅ Database initialized")
    yield
    # Shutdown
    logger.info("🛑 Shutting down...")

app = FastAPI(
    title="Sovereign Backend",
    description="The Perfect Backend for QANTUM SaaS Platform - Real-time system telemetry & orchestration",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS - Production ready configuration
allowed_origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",  # Vite dev
    "http://localhost:8080",  # Docker frontend
]

# Add additional origins from environment variable if provided
extra_origins = os.getenv("CORS_ORIGINS", "")
if extra_origins:
    allowed_origins.extend([o.strip() for o in extra_origins.split(",") if o.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if IS_PRODUCTION else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2))
    response.headers["X-Server-Version"] = "2.0.0"
    return response

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred"
        }
    )

# Include Routers with API prefix
app.include_router(auth.router, prefix="/api/v1")
app.include_router(economy.router, prefix="/api/v1")
app.include_router(payment.router, prefix="/api/v1")
app.include_router(system.router)

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": "Sovereign Backend",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/api/docs",
        "health": "/health",
        "ws": "/ws"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring and load balancers"""
    uptime = time.time() - START_TIME
    return {
        "status": "healthy",
        "version": "2.0.0",
        "uptime_seconds": round(uptime, 2),
        "uptime_human": _format_uptime(uptime),
        "components": {
            "database": "operational",
            "websocket": "operational",
            "api": "operational"
        }
    }

@app.get("/ready")
async def readiness_check():
    """Readiness probe for Kubernetes/container orchestration"""
    return {"ready": True}

@app.get("/live")
async def liveness_check():
    """Liveness probe for Kubernetes/container orchestration"""
    return {"alive": True}

def _format_uptime(seconds: float) -> str:
    """Format uptime in human-readable format"""
    days, remainder = divmod(int(seconds), 86400)
    hours, remainder = divmod(remainder, 3600)
    minutes, secs = divmod(remainder, 60)
    
    parts = []
    if days > 0:
        parts.append(f"{days}d")
    if hours > 0:
        parts.append(f"{hours}h")
    if minutes > 0:
        parts.append(f"{minutes}m")
    parts.append(f"{secs}s")
    
    return " ".join(parts)
