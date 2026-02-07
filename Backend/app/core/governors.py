import os
import random
import httpx
import asyncio
from abc import ABC, abstractmethod
from typing import Dict, Any, List

class OmniGovernor(ABC):
    def __init__(self, system_name: str, safety_threshold: float = 0.8):
        self.system_name = system_name
        self.threshold = safety_threshold
        self.current_stress = 0.0
        self.last_action = "IDLE"

    def normalize_stress(self, current_val: float, max_val: float) -> float:
        return min(max(current_val / max_val, 0.0), 1.0)

    @abstractmethod
    async def read_sensor(self) -> float: pass

    @abstractmethod
    def execute_countermeasure(self, stress_level: float, override: bool = False): pass

    @abstractmethod
    def get_max_limit(self) -> float: pass

    async def run_cycle(self):
        try:
            raw_value = await self.read_sensor()
            self.current_stress = self.normalize_stress(raw_value, self.get_max_limit())
            self.last_action = "OPTIMAL"
        except Exception as e:
            # print(f"[{self.system_name}] SENSOR ERROR: {e}")
            # Silently fail or log for SaaS
            self.current_stress = 0.0
            self.last_action = "ERROR"

class EnergyGridGovernor(OmniGovernor):
    def get_max_limit(self) -> float: return 1000.0

    async def read_sensor(self) -> float:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    "https://api.open-meteo.com/v1/forecast?latitude=42.69&longitude=23.32&current=shortwave_radiation",
                    timeout=1.0
                )
                data = resp.json()
                return float(data['current']['shortwave_radiation'])
        except:
            return 0.0

    def execute_countermeasure(self, stress_level: float, override: bool = False):
        self.last_action = "AGGRESSIVE SELL" if override else "DIVERT TO BATTERY"

class MarketRiskGovernor(OmniGovernor):
    def get_max_limit(self) -> float: return 150000.0

    async def read_sensor(self) -> float:
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
                    timeout=1.0
                )
                data = resp.json()
                return float(data['price'])
        except:
            return 95000.0 # Fallback

    def execute_countermeasure(self, stress_level: float, override: bool = False):
        self.last_action = "EMERGENCY LIQUIDATION" if override else "HEDGING"

class BioHealthGovernor(OmniGovernor):
    def get_max_limit(self) -> float: return 180.0

    async def read_sensor(self) -> float:
        # Simulation
        base = 75
        spike = 90 if random.random() > 0.85 else 0
        return base + (random.random() * 15) + spike

    def execute_countermeasure(self, stress_level: float, override: bool = False):
        self.last_action = "OPTIMIZING COMFORT" if override else "ADRENALINE BLOCK"

class ProjectAuditor:
    def __init__(self, root_path: str):
        self.root = root_path
        self.total_files = 0
        self.total_loc = 0
        self.last_run = 0
        self.cache_duration = 300

    def audit(self):
        # Synchronous file op is fine if infrequent, but for high perf loop maybe async or cached
        # We will cache as per original logic
        import time
        now = time.time()
        if now - self.last_run < self.cache_duration and self.total_files > 0:
            return self.total_files, self.total_loc

        f_count = 0
        loc_count = 0
        ignore_dirs = {'.git', 'node_modules', 'dist', 'target', '.next', '__pycache__'}

        # This might block the event loop if project is huge.
        # For "Perfect SaaS", this should be a background task, but keeping it simple for now.
        for root, dirs, files in os.walk(self.root):
            dirs[:] = [d for d in dirs if d not in ignore_dirs]
            f_count += len(files)
            for f in files:
                if f.endswith(('.ts', '.tsx', '.rs', '.py', '.html', '.css', '.js', '.json')):
                    try:
                        with open(os.path.join(root, f), 'rb') as fp:
                            # loc_count += sum(1 for line in fp)
                            # Optimize: Just count bytes / 30 as approx LOC to save IO?
                            # Or just accept the cost. Let's do a quick read.
                            loc_count += sum(1 for _ in fp)
                    except:
                        pass

        self.total_files = f_count
        self.total_loc = loc_count
        self.last_run = now
        return f_count, loc_count
