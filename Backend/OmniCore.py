import asyncio
import json
import websockets
import hashlib
import random
import requests
import secrets
import os
from abc import ABC, abstractmethod
from datetime import datetime
from Ledger import ImmutableLedger
from NexusLogic import calculate_global_entropy_rust

# ==========================================
# 1. CORE LOGIC (Същата като преди)
# ==========================================

class OmniGovernor(ABC):
    def __init__(self, system_name: str, safety_threshold: float = 0.8):
        self.system_name = system_name
        self.threshold = safety_threshold
        self.current_stress = 0.0
        self.last_action = "IDLE"  # За да пращаме статуса към UI

    def normalize_stress(self, current_val: float, max_val: float) -> float:
        return min(max(current_val / max_val, 0.0), 1.0)

    @abstractmethod
    def read_sensor(self) -> float: pass
    @abstractmethod
    def execute_countermeasure(self, stress_level: float, override: bool = False): pass
    @abstractmethod
    def get_max_limit(self) -> float: pass

    def run_cycle(self):
        try:
            raw_value = self.read_sensor()
            self.current_stress = self.normalize_stress(raw_value, self.get_max_limit())
            # Reset action state unless triggered below
            self.last_action = "OPTIMAL"
        except Exception as e:
            print(f"[{self.system_name}] SENSOR ERROR: {e}")
            self.current_stress = 0.0
            self.last_action = "ERROR"

class EnergyGridGovernor(OmniGovernor):
    def get_max_limit(self) -> float: return 1000.0
    def read_sensor(self) -> float:
        try:
            # Fast call – real API structure
            return float(requests.get("https://api.open-meteo.com/v1/forecast?latitude=42.69&longitude=23.32&current=shortwave_radiation", timeout=0.5).json()['current']['shortwave_radiation'])
        except:
            return 0.0
    def execute_countermeasure(self, stress_level: float, override: bool = False):
        self.last_action = "AGGRESSIVE SELL" if override else "DIVERT TO BATTERY"

class MarketRiskGovernor(OmniGovernor):
    def get_max_limit(self) -> float: return 150000.0
    def read_sensor(self) -> float:
        try:
            return float(requests.get("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", timeout=0.5).json()['price'])
        except:
            return 95000.0
    def execute_countermeasure(self, stress_level: float, override: bool = False):
        self.last_action = "EMERGENCY LIQUIDATION" if override else "HEDGING"

class BioHealthGovernor(OmniGovernor):
    def get_max_limit(self) -> float: return 180.0
    def read_sensor(self) -> float:
        # Simulation with occasional spike
        base = 75
        spike = 90 if random.random() > 0.85 else 0
        return base + (random.random() * 15) + spike
    def execute_countermeasure(self, stress_level: float, override: bool = False):
        self.last_action = "OPTIMIZING COMFORT" if override else "ADRENALINE BLOCK"

# ==========================================
# 2. ORCHESTRATOR + WEBSOCKET SERVER
# ==========================================

bio = BioHealthGovernor("BIO")
mkt = MarketRiskGovernor("MKT")
nrg = EnergyGridGovernor("NRG")
ledger = ImmutableLedger()  # Initialize immutable ledger

async def handler(websocket):
    print(f"Client Connected: {websocket.remote_address}")
    cycle_count = 0
    try:
        while True:
            # 1. Update Sensors
            bio.run_cycle()
            mkt.run_cycle()
            nrg.run_cycle()
            
            cycle_count += 1
            is_hallucination = False

            # --- CHAOS INJECTION (THE GLITCH) ---
            # 10% chance to generate a lie
            if random.random() < 0.10: 
                is_hallucination = True
                print(f"😈 INJECTING CHAOS/HALLUCINATION...")
                
                # Fake data (Violating Physics & Schema)
                payload = {
                    "timestamp": "INVALID_TIME", # Bad Format
                    "orchestrator": "SYSTEM COMPROMISED",
                    "bio": {"stress": 500.0, "action": "PANIC"}, # Impossible Stress (>1.0)
                    "market": {"stress": -10.0, "action": "None"}, # Impossible Negative
                    "energy": {"stress": 0.0} # MISSING FIELD "action" (Schema Violation)
                }
            else:
                # NORMAL TRUTH
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

                # Record immutable ledger entry
                ledger.add_entry(bio.current_stress, mkt.current_stress, nrg.current_stress)

                # 2. THE GOD CALCULATION (Rust)
                sovereign_index = calculate_global_entropy_rust(
                    [{'hr': 75.0, 'oxy': 0.98}],  # Mock accumulators
                    [{'price': mkt.current_stress * 100000, 'volume': 1000.0}], 
                    {'battery_level': nrg.current_stress * 100}
                )
                print(f"   🌀 SOVEREIGN INDEX: {sovereign_index:.2f}% (Rust: <0.1ms)")

                payload = {
                    "timestamp": datetime.now().strftime("%H:%M:%S"),
                    "entropy": sovereign_index,
                    "orchestrator": orchestrator_msg,
                    "bio": {"stress": bio.current_stress, "action": bio.last_action},
                    "market": {"stress": mkt.current_stress, "action": mkt.last_action},
                    "energy": {"stress": nrg.current_stress, "action": nrg.last_action}
                }

            # 4. Send to Browser
            await websocket.send(json.dumps(payload))
            
            if is_hallucination:
                print("   >>> CHAOS SENT. WAITING FOR VERITAS TO BLOCK IT.")

            await asyncio.sleep(1)  # 1 update per second
    except websockets.exceptions.ConnectionClosed:
        print("Client Disconnected")

async def main():
    # Cloud Run injects PORT environment variable
    port = int(os.environ.get("PORT", 8765))
    print(f">>> OMNI-CORE WEBSOCKET SERVER STARTED ON 0.0.0.0:{port} <<<")
    # Must bind to 0.0.0.0 for Cloud Run
    async with websockets.serve(handler, "0.0.0.0", port):
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
