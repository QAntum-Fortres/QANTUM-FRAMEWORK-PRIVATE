"""
SOVEREIGN ENGINE - Test Suite
Verifies Ledger integrity and WebSocket connectivity
"""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from Ledger import ImmutableLedger

def test_ledger_creation():
    """Test that ledger initializes with genesis block"""
    ledger = ImmutableLedger()
    assert len(ledger.chain) == 1, "Genesis block should exist"
    assert ledger.chain[0].index == 0, "Genesis index should be 0"
    print("✅ TEST 1 PASSED: Ledger creation")

def test_add_entries():
    """Test adding entries to the ledger"""
    ledger = ImmutableLedger()
    ledger.add_entry(0.5, 0.3, 0.2)
    ledger.add_entry(0.8, 0.9, 0.1)
    ledger.add_entry(0.1, 0.1, 0.8)
    
    assert len(ledger.chain) == 4, "Should have 4 blocks (genesis + 3)"
    print("✅ TEST 2 PASSED: Add entries")

def test_chain_integrity():
    """Test that chain validation works"""
    ledger = ImmutableLedger()
    ledger.add_entry(0.5, 0.3, 0.2)
    ledger.add_entry(0.8, 0.9, 0.1)
    
    assert ledger.is_chain_valid() == True, "Chain should be valid"
    print("✅ TEST 3 PASSED: Chain integrity")

def test_decision_logic():
    """Test strategy decision logic"""
    ledger = ImmutableLedger()
    
    # High stress scenario
    blk1 = ledger.add_entry(0.85, 0.9, 0.2)
    assert blk1.data['decision'] == "EMERGENCY_SHIELD", "High stress should trigger EMERGENCY_SHIELD"
    
    # Low stress scenario
    blk2 = ledger.add_entry(0.1, 0.1, 0.8)
    assert blk2.data['decision'] == "ACCELERATED_GROWTH", "Low stress should trigger ACCELERATED_GROWTH"
    
    # Normal scenario
    blk3 = ledger.add_entry(0.5, 0.5, 0.5)
    assert blk3.data['decision'] == "MAINTAIN_BALANCE", "Normal stress should MAINTAIN_BALANCE"
    
    print("✅ TEST 4 PASSED: Decision logic")

def test_hash_uniqueness():
    """Test that each block has unique hash"""
    ledger = ImmutableLedger()
    ledger.add_entry(0.5, 0.5, 0.5)
    ledger.add_entry(0.5, 0.5, 0.5)  # Same data, different block
    
    hashes = [block.hash for block in ledger.chain]
    assert len(hashes) == len(set(hashes)), "All hashes should be unique"
    print("✅ TEST 5 PASSED: Hash uniqueness")

def test_sliding_window():
    """Test that ledger caps size at max_len"""
    max_len = 10
    ledger = ImmutableLedger(max_len=max_len)

    # Add 15 entries
    for i in range(15):
        ledger.add_entry(0.5, 0.5, 0.5)

    assert len(ledger.chain) == max_len, f"Chain length should be {max_len}, got {len(ledger.chain)}"

    # Blocks: 0 (Genesis), 1, 2, ..., 15. Total 16 blocks.
    # Keep last 10: 6, 7, ..., 15.

    first_block = ledger.chain[0]
    last_block = ledger.chain[-1]

    assert first_block.index == 6, f"First block index should be 6, got {first_block.index}"
    assert last_block.index == 15, f"Last block index should be 15, got {last_block.index}"

    print("✅ TEST 6 PASSED: Sliding window")

if __name__ == "__main__":
    print("\n" + "="*50)
    print("🧪 SOVEREIGN ENGINE - TEST SUITE")
    print("="*50 + "\n")
    
    try:
        test_ledger_creation()
        test_add_entries()
        test_chain_integrity()
        test_decision_logic()
        test_hash_uniqueness()
        test_sliding_window()
        
        print("\n" + "="*50)
        print("🎉 ALL TESTS PASSED!")
        print("="*50 + "\n")
    except AssertionError as e:
        print(f"\n❌ TEST FAILED: {e}")
        sys.exit(1)
