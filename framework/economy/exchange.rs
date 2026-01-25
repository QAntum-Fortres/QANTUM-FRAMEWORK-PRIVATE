use crate::types::AssetBalance;
use rust_decimal::Decimal;

pub struct BinanceConnector {
    api_key: String,
}

impl BinanceConnector {
    pub fn new(api_key: String) -> Self {
        Self { api_key }
    }

    /// Big O: O(1)
    pub fn get_balance(&self, asset: &str) -> AssetBalance {
        // Mocking balance for system stabilization
        AssetBalance {
            asset: asset.to_string(),
            free: Decimal::new(100, 0),
            locked: Decimal::ZERO,
            total: Decimal::new(100, 0),
        }
    }
}
