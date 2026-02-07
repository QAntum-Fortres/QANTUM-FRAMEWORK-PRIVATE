import sys
import asyncio
import os

# Add Backend to path so we can import 'app'
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.logic import calculate_global_entropy
from app.core.governors import BioHealthGovernor
from app.database import init_db, engine
from app.models import User
from sqlmodel import select, Session

async def verify():
    print("🔍 Starting Verification...")

    # 1. Logic Check
    print("   Checking Logic Core...", end=" ")
    bio = [{'hr': 75.0, 'oxy': 0.98}]
    mkt = [{'price': 50000.0, 'volume': 1000.0}]
    nrg = {'battery_level': 50.0}
    entropy = calculate_global_entropy(bio, mkt, nrg)
    print(f"OK (Entropy: {entropy:.4f})")
    assert 0 <= entropy <= 100, "Entropy out of bounds"

    # 2. Governor Check
    print("   Checking Governor...", end=" ")
    gov = BioHealthGovernor("TEST_BIO")
    val = await gov.read_sensor()
    print(f"OK (Sensor Value: {val:.4f})")

    # 3. DB Check
    print("   Checking Database...", end=" ")
    # Override DB URL to memory for test if possible, but our database.py uses a hardcoded file or memory default
    # The current database.py uses "sqlite+aiosqlite:///./backend.db"
    # We will just init it.
    try:
        await init_db()
        print("OK (Tables Created)")
    except Exception as e:
        print(f"FAILED: {e}")
        sys.exit(1)

    print("✅ VERIFICATION SUCCESSFUL")

if __name__ == "__main__":
    asyncio.run(verify())
