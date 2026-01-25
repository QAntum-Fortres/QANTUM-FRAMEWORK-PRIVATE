import ctypes
import json
import os
import platform
import time
from pathlib import Path

# 1. AUTO-DETECT OS & PATH
system_os = platform.system()
lib_name = "rust_core.dll" if system_os == "Windows" else "librust_core.so"
if system_os == "Darwin": lib_name = "librust_core.dylib"

# Locate the binary relative to this script (Root/rust_core/target/release/...)
lib_path = Path(__file__).parent / "rust_core" / "target" / "release" / lib_name

print(f"[NEXUS] Loading Rust Core from: {lib_path}")

RUST_AVAILABLE = False
try:
    if lib_path.exists():
        _rust = ctypes.CDLL(str(lib_path))
        
        # Define signature for NEW function name
        _rust.process_and_sign_cycle.argtypes = [ctypes.c_char_p, ctypes.c_size_t]
        _rust.process_and_sign_cycle.restype = ctypes.c_double
        
        RUST_AVAILABLE = True
    else:
        print(f"[NEXUS] ⚠️ CRITICAL: Rust binary not found at {lib_path}")
except Exception as e:
    print(f"[NEXUS] ⚠️ CRITICAL: Could not load Rust DLL. Error: {e}")

# 2. THE WRAPPER FUNCTION
def calculate_global_entropy_rust(bio_stream, mkt_stream, nrg_stream):
    """
    Serializes data and sends it to the compiled Rust kernel.
    """
    if not RUST_AVAILABLE:
        print("[NEXUS] Fallback: Rust not available")
        return 0.0 # Fail-safe
        
    # Pack data
    payload = json.dumps({
        "bio_data_stream": bio_stream,
        "market_data_stream": mkt_stream,
        "energy_data_stream": nrg_stream,
    }).encode('utf-8')
    
    # Execute Foreign Function (New Name)
    result = _rust.process_and_sign_cycle(payload, len(payload))
    
    # Error Handling (from Rust error codes)
    if result == -1.0: print("[NEXUS] Rust Error: Null Pointer")
    if result == -2.0: print("[NEXUS] Rust Error: Bad JSON")
    
    return result

if __name__ == "__main__":
    # Self-test
    bio = [{'hr': 75.0, 'oxy': 0.98}]
    mkt = [{'price': 50000.0, 'volume': 1000.0}]
    nrg = {'battery_level': 50.0}
    start = time.perf_counter()
    res = calculate_global_entropy_rust(bio, mkt, nrg)
    end = time.perf_counter()
    print(f"Self-Test Result: {res} | Time: {(end-start)*1000:.4f}ms")
