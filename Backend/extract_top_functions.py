#!/usr/bin/env python3
"""
extract_top_functions.py
-----------------------
Parse the brain‑map JSON and list the top N functions by complexity.
The script prints a table:
    Rank | File | Function | Complexity | Calls
Usage:
    python extract_top_functions.py
Edit BRAIN_MAP_PATH if the JSON lives elsewhere.
"""

import json
import pathlib
import sys
from typing import List, Dict, Any

# Configuration
BRAIN_MAP_PATH = pathlib.Path(r"C:\Users\papic\Downloads\QAntumBVortex-main\QAntumBVortex-main\data\VORTEX_DATA\brain-map.json")
TOP_N = 50


def load_brain_map(path: pathlib.Path) -> Dict[str, Any]:
    if not path.is_file():
        sys.exit(f"[Error] Brain‑map not found at {path}")
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def collect_functions(brain: Dict[str, Any]) -> List[Dict[str, Any]]:
    results = []
    for file_name, meta in brain.get("files", {}).items():
        for fn in meta.get("functions", []):
            results.append({
                "file": file_name,
                "name": fn.get("name", "<anonymous>"),
                "complexity": int(fn.get("complexity", 0)),
                "calls": len(fn.get("calls", [])),
            })
    return results


def main() -> None:
    brain = load_brain_map(BRAIN_MAP_PATH)
    functions = collect_functions(brain)
    if not functions:
        sys.exit("[Info] No functions found in brain‑map.")
    # Sort by complexity desc, then calls desc
    functions.sort(key=lambda x: (x["complexity"], x["calls"]), reverse=True)
    top = functions[:TOP_N]
    header = f"{'Rank':>4} | {'File':<30} | {'Function':<25} | {'Complexity':>10} | {'Calls':>5}"
    sep = "-" * len(header)
    print(header)
    print(sep)
    for i, fn in enumerate(top, start=1):
        print(f"{i:>4} | {fn['file'][:30]:<30} | {fn['name'][:25]:<25} | {fn['complexity']:>10} | {fn['calls']:>5}")
    print(f"\nDisplayed top {len(top)} functions.")

if __name__ == "__main__":
    main()
