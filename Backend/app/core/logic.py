import math
import hashlib
import json
import logging
from typing import List, Dict, Any

logger = logging.getLogger("core.logic")

def calculate_global_entropy(
    bio_data: List[Dict[str, float]],
    market_data: List[Dict[str, float]],
    energy_data: Dict[str, float]
) -> float:
    """
    Python port of the Rust 'God Calculation'.
    Calculates a global entropy index based on bio-market-energy resonance.
    """
    total_entropy = 0.0

    battery_level = energy_data.get("battery_level", 0.0)

    for bio in bio_data:
        hr = bio.get("hr", 0.0)
        oxy = bio.get("oxy", 0.0)
        b_val = (hr * 0.5) + (oxy * 2.0)

        for market in market_data:
            price = market.get("price", 0.0)
            volume = market.get("volume", 0.0)
            m_val = (price / volume) if volume > 0.0 else 0.0

            if b_val > 50.0 and m_val < 0.001:
                multiplier = 2.5 if battery_level < 20.0 else 0.1
                total_entropy += (b_val * m_val) * multiplier
            elif b_val < 20.0 and m_val > 0.05:
                golden = math.sqrt(b_val * m_val) if (b_val * m_val) >= 0 else 0.0
                if golden > 1.618:
                    total_entropy -= golden
                else:
                    total_entropy += 0.01
            else:
                total_entropy += abs(math.sin(b_val) * math.cos(m_val)) * 0.001

    # Clamp and invert
    final_index = 100.0 - max(0.0, min(total_entropy, 100.0))
    return final_index

def sign_and_record_cycle(
    bio_data: List[Dict[str, float]],
    market_data: List[Dict[str, float]],
    energy_data: Dict[str, float],
    final_index: float
) -> str:
    """
    Generates a SHA-512 hash of the cycle and returns it.
    Real SaaS would write to DB here, but we return the hash for the caller to decide.
    """
    payload = {
        "bio": bio_data,
        "market": market_data,
        "energy": energy_data,
        "index": final_index
    }
    # Sort keys for consistent hashing
    payload_str = json.dumps(payload, sort_keys=True)

    hasher = hashlib.sha512()
    hasher.update(payload_str.encode('utf-8'))
    # Also update with final index bytes like Rust did (though json dump includes it, this mimics the "extra seal")
    # Rust: hasher.update(final_index.to_be_bytes());
    # We'll just stick to the payload hash for Python simplicity unless strict compatibility is needed.
    # But let's add the index specifically to match the spirit.
    hasher.update(str(final_index).encode('utf-8'))

    return hasher.hexdigest()
