// lwas_core/src/security/apoptosis.rs
// IDENTITY: APOPTOSIS_PROTOCOL (The Seventh Pillar)
// ARCHITECT: DIMITAR PRODROMOV | AUTHORITY: 0x4121

use hmac::{Hmac, Mac};
use serde::{Deserialize, Serialize};
use sha2::Sha256;
use std::time::{SystemTime, UNIX_EPOCH};

type HmacSha256 = Hmac<Sha256>;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LivenessToken {
    pub module_id: String,
    pub timestamp: u64,
    pub status: String,
    pub signature: String,
}

pub struct ApoptosisModule {
    private_key: Vec<u8>,
}

impl ApoptosisModule {
    pub fn new(key: &str) -> Self {
        Self {
            private_key: key.as_bytes().to_vec(),
        }
    }

    /// O(1) - Generate a military-grade liveness token
    pub fn generate_token(&self, module_id: &str, status: &str) -> LivenessToken {
        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();

        let payload = format!("{}:{}:{}", module_id, timestamp, status);
        let mut mac = HmacSha256::new_from_slice(&self.private_key).expect("HMAC_INIT_FAIL");
        mac.update(payload.as_bytes());
        let signature = hex::encode(mac.finalize().into_bytes());

        LivenessToken {
            module_id: module_id.to_string(),
            timestamp,
            status: status.to_string(),
            signature,
        }
    }

    /// O(1) - Verify token and prevent logic decay (Apoptosis)
    pub fn verify_vitality(&self, token: &LivenessToken, expected_module: &str) -> bool {
        // 1. Module ID Spoofing Protection
        if token.module_id != expected_module {
            return false;
        }

        // 2. Replay Attack Protection (5-minute window)
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        if now > token.timestamp + 300 || now < token.timestamp - 60 {
            return false;
        }

        // 3. Cryptographic Signature Verification
        let payload = format!("{}:{}:{}", token.module_id, token.timestamp, token.status);
        let mut mac = HmacSha256::new_from_slice(&self.private_key).expect("HMAC_VERIFY_FAIL");
        mac.update(payload.as_bytes());

        let expected_sig = hex::encode(mac.finalize().into_bytes());
        token.signature == expected_sig
    }
}
