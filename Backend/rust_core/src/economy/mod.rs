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

    pub fn unlock_modules(&self, user_id: String, modules: Vec<(String, f64)>) -> Result<UserBalance, String> {
        let mut balances = self.balances.lock().unwrap();

        let balance = balances.get_mut(&user_id).ok_or("User not found")?;

        let total_cost: f64 = modules.iter().map(|(_, cost)| cost).sum();

        if balance.credits < total_cost {
            return Err("Insufficient credits".to_string());
        }

        balance.credits -= total_cost;

        for (module_name, _) in &modules {
            if !balance.unlocked_modules.contains(module_name) {
                balance.unlocked_modules.push(module_name.clone());
            }
        }

        // Record transaction (single transaction for batch unlock)
        let tx = Transaction {
            id: format!("tx_{}", chrono::Utc::now().timestamp()),
            user_id: user_id.clone(),
            amount: -total_cost,
            transaction_type: "unlock_batch".to_string(),
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_unlock_modules_batch() {
        let economy = EconomyEngine::new();
        let user_id = "test_user".to_string();

        // Initial setup: mint 100 credits
        economy.mint_credits(user_id.clone(), 100.0).unwrap();

        // Define batch of modules
        let modules = vec![
            ("module_a".to_string(), 10.0),
            ("module_b".to_string(), 20.0),
            ("module_c".to_string(), 5.0),
        ];

        // Unlock batch
        let result = economy.unlock_modules(user_id.clone(), modules).unwrap();

        // Assertions
        assert_eq!(result.credits, 65.0); // 100 - 10 - 20 - 5 = 65
        assert!(result.unlocked_modules.contains(&"module_a".to_string()));
        assert!(result.unlocked_modules.contains(&"module_b".to_string()));
        assert!(result.unlocked_modules.contains(&"module_c".to_string()));

        // Verify transaction count (1 for mint, 1 for batch unlock)
        assert_eq!(economy.get_transaction_count(), 2);
    }

    #[test]
    fn test_unlock_modules_insufficient_credits() {
        let economy = EconomyEngine::new();
        let user_id = "broke_user".to_string();

        economy.mint_credits(user_id.clone(), 10.0).unwrap();

        let modules = vec![
            ("expensive_module".to_string(), 20.0),
        ];

        let result = economy.unlock_modules(user_id.clone(), modules);

        assert!(result.is_err());
        assert_eq!(result.unwrap_err(), "Insufficient credits");
    }
}
