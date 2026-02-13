// lwas_core/src/security/sovereign_identity.rs
use crate::prelude::*; // Correctly pull the unified types
use sha2::{Digest, Sha256};
use hex;

pub struct IdentityValidator;

impl IdentityValidator {
    pub const MASTER_KEY: &'static str = "0x41_45_54_45_52_4e_41_5f_4c_4f_47_4f_53_5f_44_49_4d_49_54_41_52_5f_50_52_4f_44_52_4f_4d_4f_56_21";

    pub fn verify_resonance(signature: &str) -> SovereignResult<()> {
        let clean_key = Self::MASTER_KEY.trim_start_matches("0x").replace("_", "");
        let decoded_master_key = hex::decode(&clean_key).expect("Invalid MASTER_KEY format");

        let mut hasher = Sha256::new();
        hasher.update(&decoded_master_key);
        let master_hash = hasher.finalize();

        let mut input_hasher = Sha256::new();
        input_hasher.update(signature.as_bytes());
        let input_hash = input_hasher.finalize();

        if master_hash == input_hash {
            println!("💎 [AETERNA]: Resonance confirmed. Greetings, Architect.");
            Ok(())
        } else {
            Err(SovereignError::IdentityMismatch)
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_verify_resonance_success() {
        assert!(IdentityValidator::verify_resonance("AETERNA_LOGOS_DIMITAR_PRODROMOV!").is_ok());
    }
}
