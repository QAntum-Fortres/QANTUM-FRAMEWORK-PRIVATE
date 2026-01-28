import asyncio
import json
import random
import logging
from datetime import datetime
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_session
from app.models import LedgerEntry
from app.core.governors import BioHealthGovernor, MarketRiskGovernor, EnergyGridGovernor, ProjectAuditor
from app.core.logic import calculate_global_entropy, sign_and_record_cycle

router = APIRouter(tags=["system"])
logger = logging.getLogger("system")

# Global State (Singleton Governors)
bio = BioHealthGovernor("BIO")
mkt = MarketRiskGovernor("MKT")
nrg = EnergyGridGovernor("NRG")
# Adjust path to root of repo
import os
# Points to /code (Docker) or Backend/ (Local)
auditor = ProjectAuditor(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket): #, session: AsyncSession = Depends(get_session)):
    # Note: Depends(get_session) inside websocket might behave differently or close early.
    # Better to create session inside the loop if needed or use a context manager.
    # But for now, we only need DB for ledger writing.

    await websocket.accept()
    logger.info("Client connected to System Core")

    try:
        while True:
            # 1. Update Sensors
            await bio.run_cycle()
            await mkt.run_cycle()
            await nrg.run_cycle()

            # 2. Chaos Logic
            is_hallucination = False
            if random.random() < 0.05: # Reduced from 10% to 5% for stability
                is_hallucination = True
                payload = {
                    "timestamp": "INVALID_TIME",
                    "orchestrator": "SYSTEM COMPROMISED",
                    "bio": {"stress": 500.0, "action": "PANIC"},
                    "market": {"stress": -10.0, "action": "None"},
                    "energy": {"stress": 0.0}
                }
            else:
                # Orchestrator Logic
                orchestrator_msg = "SYSTEM SYNCED"
                if bio.current_stress > 0.6:
                    mkt.execute_countermeasure(mkt.current_stress, override=True)
                    orchestrator_msg = "⚠️ HOST STRESS! REDUCING FINANCIAL RISK"
                elif mkt.current_stress > 0.9:
                    nrg.execute_countermeasure(nrg.current_stress, override=True)
                    orchestrator_msg = "📉 MARKET CRASH! ACTIVATING ENERGY ARBITRAGE"
                elif nrg.current_stress < 0.1 and bio.current_stress > 0.3:
                    bio.execute_countermeasure(bio.current_stress, override=True)
                    orchestrator_msg = "🔋 FREE ENERGY. BOOSTING COMFORT"

                # 3. God Calculation
                # Data formatting
                bio_data = [{'hr': 75.0, 'oxy': 0.98}] # Mock stream data, in real app this would come from `bio.read_sensor` if it returned complex data
                mkt_data = [{'price': mkt.current_stress * 100000, 'volume': 1000.0}]
                nrg_data = {'battery_level': nrg.current_stress * 100}

                entropy_index = calculate_global_entropy(bio_data, mkt_data, nrg_data)

                # Sign cycle (generates hash)
                block_hash = sign_and_record_cycle(bio_data, mkt_data, nrg_data, entropy_index)

                # DB Write (Async) - TODO: Inject session properly or use a background task
                # For high-freq websockets, writing to DB every second might be heavy for SQLite.
                # We'll skip DB write in this loop for the demo to ensure speed, or do it periodically.

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
                    "hash": block_hash[:8]
                }

            await websocket.send_json(payload)
            await asyncio.sleep(1)

    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket Error: {e}")
        try:
            await websocket.close()
        except:
            pass
