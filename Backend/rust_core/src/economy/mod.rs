use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserBalance {
    pub user_id: String,
    pub credits: f64,
    pub unlocked_modules: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    pub id: String,
    pub user_id: String,
    pub amount: f64,
    pub transaction_type: String,
    pub timestamp: u64,
}

pub struct EconomyEngine {
    balances: Arc<Mutex<HashMap<String, UserBalance>>>,
    transactions: Arc<Mutex<Vec<Transaction>>>,
}

impl EconomyEngine {
    pub fn new() -> Self {
        Self {
            balances: Arc::new(Mutex::new(HashMap::new())),
            transactions: Arc::new(Mutex::new(Vec::new())),
        }
    }

    pub fn mint_credits(&self, user_id: String, amount: f64) -> Result<UserBalance, String> {
        let mut balances = self.balances.lock().unwrap();
        
        let balance = balances.entry(user_id.clone()).or_insert(UserBalance {
            user_id: user_id.clone(),
            credits: 0.0,
            unlocked_modules: Vec::new(),
        });
        
        balance.credits += amount;
        
        // Record transaction
        let tx = Transaction {
            id: format!("tx_{}", chrono::Utc::now().timestamp()),
            user_id: user_id.clone(),
            amount,
            transaction_type: "mint".to_string(),
            timestamp: chrono::Utc::now().timestamp() as u64,
        };
        
        self.transactions.lock().unwrap().push(tx);
        
        Ok(balance.clone())
    }

    pub fn unlock_module(&self, user_id: String, module_name: String, cost: f64) -> Result<UserBalance, String> {
        let mut balances = self.balances.lock().unwrap();
        
        let balance = balances.get_mut(&user_id).ok_or("User not found")?;
        
        if balance.credits < cost {
            return Err("Insufficient credits".to_string());
        }
        
        balance.credits -= cost;
        
        if !balance.unlocked_modules.contains(&module_name) {
            balance.unlocked_modules.push(module_name.clone());
        }
        
        // Record transaction
        let tx = Transaction {
            id: format!("tx_{}", chrono::Utc::now().timestamp()),
            user_id: user_id.clone(),
            amount: -cost,
            transaction_type: format!("unlock_{}", module_name),
            timestamp: chrono::Utc::now().timestamp() as u64,
        };
        
        self.transactions.lock().unwrap().push(tx);
        
        Ok(balance.clone())
    }

    pub fn get_balance(&self, user_id: &str) -> Option<UserBalance> {
        self.balances.lock().unwrap().get(user_id).cloned()
    }

    pub fn get_transaction_count(&self) -> usize {
        self.transactions.lock().unwrap().len()
    }

    pub fn get_all_balances(&self) -> Vec<UserBalance> {
        self.balances.lock().unwrap().values().cloned().collect()
    }
}

// Simple timestamp module (no external dependencies)
mod chrono {
    use std::time::{SystemTime, UNIX_EPOCH};
    
    pub struct Utc;
    
    impl Utc {
        pub fn now() -> DateTime {
            DateTime
        }
    }
    
    pub struct DateTime;
    
    impl DateTime {
        pub fn timestamp(&self) -> i64 {
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs() as i64
        }
    }
}
