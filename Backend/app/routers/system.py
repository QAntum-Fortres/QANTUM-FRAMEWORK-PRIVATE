import asyncio
import json
import random
import logging
import time
from datetime import datetime
from typing import Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException

from app.core.governors import BioHealthGovernor, MarketRiskGovernor, EnergyGridGovernor, ProjectAuditor
from app.core.logic import calculate_global_entropy, sign_and_record_cycle

router = APIRouter(tags=["system"])
logger = logging.getLogger("system")

# Constants
MAX_CONNECTIONS = 100
CYCLE_INTERVAL_SECONDS = 1.0
MIN_SLEEP_TIME_SECONDS = 0.1
CHAOS_PROBABILITY = 0.02  # 2% chance of anomaly

# Global State (Singleton Governors)
bio = BioHealthGovernor("BIO")
mkt = MarketRiskGovernor("MKT")
nrg = EnergyGridGovernor("NRG")

# Adjust path to root of repo
import os
# Points to /code (Docker) or Backend/ (Local)
auditor = ProjectAuditor(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

# Connection management
active_connections: Set[WebSocket] = set()

@router.get("/api/v1/system/status")
async def system_status():
    """Get current system status without WebSocket"""
    await bio.run_cycle()
    await mkt.run_cycle()
    await nrg.run_cycle()

    bio_data = [{'hr': 75.0, 'oxy': 0.98}]
    mkt_data = [{'price': mkt.current_stress * 100000, 'volume': 1000.0}]
    nrg_data = {'battery_level': nrg.current_stress * 100}

    entropy_index = calculate_global_entropy(bio_data, mkt_data, nrg_data)
    block_hash = sign_and_record_cycle(bio_data, mkt_data, nrg_data, entropy_index)
    f_count, loc_count = auditor.audit()

    return {
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "entropy": entropy_index,
        "bio": {"stress": bio.current_stress, "action": bio.last_action},
        "market": {"stress": mkt.current_stress, "action": mkt.last_action},
        "energy": {"stress": nrg.current_stress, "action": nrg.last_action},
        "project": {"files": f_count, "loc": loc_count},
        "hash": block_hash[:8],
        "connections": len(active_connections)
    }

@router.get("/api/v1/system/connections")
async def get_connections():
    """Get number of active WebSocket connections"""
    return {
        "active_connections": len(active_connections),
        "max_connections": MAX_CONNECTIONS
    }

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    # Check connection limit
    if len(active_connections) >= MAX_CONNECTIONS:
        await websocket.close(code=1013, reason="Max connections reached")
        logger.warning(f"Connection rejected: max connections ({MAX_CONNECTIONS}) reached")
        return

    await websocket.accept()
    active_connections.add(websocket)
    logger.info(f"Client connected to System Core. Active: {len(active_connections)}")

    try:
        while True:
            cycle_start = time.time()

            # 1. Update Sensors
            await bio.run_cycle()
            await mkt.run_cycle()
            await nrg.run_cycle()

            # 2. Chaos Logic - Small probability of anomaly for testing resilience
            is_hallucination = random.random() < CHAOS_PROBABILITY
            if is_hallucination:
                payload = {
                    "timestamp": "INVALID_TIME",
                    "orchestrator": "⚠️ SYSTEM ANOMALY DETECTED",
                    "bio": {"stress": 999.0, "action": "CHAOS"},
                    "market": {"stress": -1.0, "action": "VOID"},
                    "energy": {"stress": 0.0, "action": "NULL"},
                    "type": "hallucination"
                }
            else:
                # Orchestrator Logic
                orchestrator_msg = "✅ SYSTEM SYNCED"
                if bio.current_stress > 0.6:
                    mkt.execute_countermeasure(mkt.current_stress, override=True)
                    orchestrator_msg = "⚠️ HOST STRESS ELEVATED! REDUCING FINANCIAL RISK"
                elif mkt.current_stress > 0.9:
                    nrg.execute_countermeasure(nrg.current_stress, override=True)
                    orchestrator_msg = "📉 MARKET VOLATILITY! ACTIVATING ENERGY ARBITRAGE"
                elif nrg.current_stress < 0.1 and bio.current_stress > 0.3:
                    bio.execute_countermeasure(bio.current_stress, override=True)
                    orchestrator_msg = "🔋 SURPLUS ENERGY DETECTED. OPTIMIZING COMFORT"

                # 3. God Calculation
                bio_data = [{'hr': 75.0, 'oxy': 0.98}]
                mkt_data = [{'price': mkt.current_stress * 100000, 'volume': 1000.0}]
                nrg_data = {'battery_level': nrg.current_stress * 100}

                entropy_index = calculate_global_entropy(bio_data, mkt_data, nrg_data)
                block_hash = sign_and_record_cycle(bio_data, mkt_data, nrg_data, entropy_index)

                # 4. Auditor
                f_count, loc_count = auditor.audit()

                payload = {
                    "timestamp": datetime.now().strftime("%H:%M:%S"),
                    "entropy": entropy_index,
                    "orchestrator": orchestrator_msg,
                    "bio": {"stress": bio.current_stress, "action": bio.last_action},
                    "market": {"stress": mkt.current_stress, "action": mkt.last_action},
                    "energy": {"stress": nrg.current_stress, "action": nrg.last_action},
                    "project": {"files": f_count, "loc": loc_count},
                    "hash": block_hash[:8],
                    "type": "telemetry"
                }

            await websocket.send_json(payload)

            # Maintain consistent cycle intervals accounting for processing time
            cycle_time = time.time() - cycle_start
            sleep_time = max(MIN_SLEEP_TIME_SECONDS, CYCLE_INTERVAL_SECONDS - cycle_time)
            await asyncio.sleep(sleep_time)

    except WebSocketDisconnect:
        active_connections.discard(websocket)
        logger.info(f"Client disconnected. Active: {len(active_connections)}")
    except Exception as e:
        active_connections.discard(websocket)
        logger.error(f"WebSocket Error: {e}")
        try:
            await websocket.close(code=1011, reason="Internal error")
        except:
            pass
