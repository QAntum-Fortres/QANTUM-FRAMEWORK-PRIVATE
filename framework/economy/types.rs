use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

/// Big O: O(1) for all financial arithmetic
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Transaction {
    pub id: Uuid,
    pub amount: Decimal,
    pub currency: String,
    pub provider: String,
    pub status: TransactionStatus,
    pub timestamp: DateTime<Utc>,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum TransactionStatus {
    Pending,
    Processing,
    Succeeded,
    Failed,
    Cancelled,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubscriptionPlan {
    pub id: String,
    pub name: String,
    pub price: Decimal,
    pub interval: String, // e.g., "month"
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AssetBalance {
    pub asset: String,
    pub free: Decimal,
    pub locked: Decimal,
    pub total: Decimal,
}
