// LwaS Economy - Quantum Economic Engine
// Real-time Equity and Profitability Calculation Module
//
// ENTERPRISE DOCUMENTATION:
// This module handles all economic calculations within the LwaS ecosystem,
// including equity tracking, profitability metrics, and quantum-inspired
// economic modeling for the QANTUM framework.
//
// Integration Points:
// - Stripe Payment Gateway (via omni_core)
// - Telemetry System (for market data)
// - Core Compiler (for resource usage tracking)

use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use std::collections::HashMap;

/// Represents a financial transaction in the quantum economy
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    pub id: String,
    pub amount: f64,
    pub currency: String,
    pub timestamp: DateTime<Utc>,
    pub tx_type: TransactionType,
    pub metadata: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum TransactionType {
    Payment,
    Refund,
    Commission,
    Royalty,
}

/// Economic metrics for real-time tracking
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EconomicMetrics {
    pub total_equity: f64,
    pub current_profitability: f64,
    pub transaction_count: u64,
    pub average_transaction_value: f64,
    pub growth_rate: f64,
    pub last_updated: DateTime<Utc>,
}

impl EconomicMetrics {
    pub fn new() -> Self {
        Self {
            total_equity: 0.0,
            current_profitability: 0.0,
            transaction_count: 0,
            average_transaction_value: 0.0,
            growth_rate: 0.0,
            last_updated: Utc::now(),
        }
    }

    /// Updates metrics with a new transaction
    pub fn process_transaction(&mut self, tx: &Transaction) {
        self.transaction_count += 1;
        
        match tx.tx_type {
            TransactionType::Payment | TransactionType::Royalty => {
                self.total_equity += tx.amount;
            }
            TransactionType::Refund => {
                self.total_equity -= tx.amount;
            }
            TransactionType::Commission => {
                self.total_equity -= tx.amount;
            }
        }

        // Recalculate average
        self.average_transaction_value = self.total_equity / self.transaction_count as f64;
        
        // Update timestamp
        self.last_updated = Utc::now();
        
        // Calculate profitability (simplified model)
        self.update_profitability();
    }

    /// Calculates current profitability based on equity and transaction patterns
    fn update_profitability(&mut self) {
        // Quantum-inspired profitability calculation
        // Factors: equity growth, transaction velocity, average value
        let base_profit = self.total_equity * 0.15; // 15% profit margin
        let velocity_bonus = (self.transaction_count as f64).sqrt() * 10.0;
        
        self.current_profitability = base_profit + velocity_bonus;
        
        // Calculate growth rate (percentage)
        if self.transaction_count > 1 {
            self.growth_rate = (self.current_profitability / self.total_equity) * 100.0;
        }
    }

    /// Generates a comprehensive financial report
    pub fn generate_report(&self) -> FinancialReport {
        FinancialReport {
            metrics: self.clone(),
            report_time: Utc::now(),
            status: if self.current_profitability > 0.0 {
                EconomicStatus::Profitable
            } else {
                EconomicStatus::Developing
            },
        }
    }
}

impl Default for EconomicMetrics {
    fn default() -> Self {
        Self::new()
    }
}

/// Financial report structure
#[derive(Debug, Serialize, Deserialize)]
pub struct FinancialReport {
    pub metrics: EconomicMetrics,
    pub report_time: DateTime<Utc>,
    pub status: EconomicStatus,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum EconomicStatus {
    Profitable,
    BreakingEven,
    Developing,
}

/// Main economy engine
pub struct EconomyEngine {
    metrics: EconomicMetrics,
    transactions: Vec<Transaction>,
}

impl EconomyEngine {
    pub fn new() -> Self {
        Self {
            metrics: EconomicMetrics::new(),
            transactions: Vec::new(),
        }
    }

    /// Records a new transaction and updates metrics
    pub fn record_transaction(&mut self, tx: Transaction) {
        self.metrics.process_transaction(&tx);
        self.transactions.push(tx);
    }

    /// Gets current economic metrics
    pub fn get_metrics(&self) -> &EconomicMetrics {
        &self.metrics
    }

    /// Gets transaction history
    pub fn get_transactions(&self) -> &[Transaction] {
        &self.transactions
    }

    /// Generates equity report
    pub fn get_equity_report(&self) -> f64 {
        self.metrics.total_equity
    }

    /// Generates profitability report
    pub fn get_profitability_report(&self) -> f64 {
        self.metrics.current_profitability
    }
}

impl Default for EconomyEngine {
    fn default() -> Self {
        Self::new()
    }
}

/// FFI function for external integrations (Python, JavaScript, etc.)
#[no_mangle]
pub extern "C" fn calculate_equity(tx_data_ptr: *const u8, tx_data_len: usize) -> f64 {
    if tx_data_ptr.is_null() || tx_data_len == 0 {
        return -1.0;
    }

    let slice = unsafe { std::slice::from_raw_parts(tx_data_ptr, tx_data_len) };
    
    let transactions: Vec<Transaction> = match serde_json::from_slice(slice) {
        Ok(txs) => txs,
        Err(_) => return -2.0,
    };

    let mut engine = EconomyEngine::new();
    for tx in transactions {
        engine.record_transaction(tx);
    }

    engine.get_equity_report()
}

/// FFI function for profitability calculation
#[no_mangle]
pub extern "C" fn calculate_profitability(tx_data_ptr: *const u8, tx_data_len: usize) -> f64 {
    if tx_data_ptr.is_null() || tx_data_len == 0 {
        return -1.0;
    }

    let slice = unsafe { std::slice::from_raw_parts(tx_data_ptr, tx_data_len) };
    
    let transactions: Vec<Transaction> = match serde_json::from_slice(slice) {
        Ok(txs) => txs,
        Err(_) => return -2.0,
    };

    let mut engine = EconomyEngine::new();
    for tx in transactions {
        engine.record_transaction(tx);
    }

    engine.get_profitability_report()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_metrics_creation() {
        let metrics = EconomicMetrics::new();
        assert_eq!(metrics.total_equity, 0.0);
        assert_eq!(metrics.transaction_count, 0);
    }

    #[test]
    fn test_transaction_processing() {
        let mut metrics = EconomicMetrics::new();
        let tx = Transaction {
            id: "tx_001".to_string(),
            amount: 100.0,
            currency: "USD".to_string(),
            timestamp: Utc::now(),
            tx_type: TransactionType::Payment,
            metadata: HashMap::new(),
        };
        
        metrics.process_transaction(&tx);
        assert_eq!(metrics.total_equity, 100.0);
        assert_eq!(metrics.transaction_count, 1);
    }

    #[test]
    fn test_economy_engine() {
        let mut engine = EconomyEngine::new();
        let tx = Transaction {
            id: "tx_001".to_string(),
            amount: 500.0,
            currency: "USD".to_string(),
            timestamp: Utc::now(),
            tx_type: TransactionType::Payment,
            metadata: HashMap::new(),
        };
        
        engine.record_transaction(tx);
        assert_eq!(engine.get_equity_report(), 500.0);
        assert!(engine.get_profitability_report() > 0.0);
    }
}
