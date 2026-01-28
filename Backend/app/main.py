import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database import init_db
from app.routers import auth, economy, payment, system

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Sovereign Backend v2.0 Starting...")
    await init_db()
    yield
    # Shutdown
    logger.info("🛑 Shutting down...")

app = FastAPI(
    title="Sovereign Backend",
    description="The Perfect Backend for Free Tier Render",
    version="2.0.0",
    lifespan=lifespan
)

# CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # Vite
    "https://your-frontend-url.onrender.com",
    "*" # Allow all for now for ease of dev
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(economy.router)
app.include_router(payment.router)
app.include_router(system.router)

@app.get("/")
async def root():
    return {
        "message": "Sovereign Backend Online",
        "docs": "/docs",
        "ws": "/ws"
    }
