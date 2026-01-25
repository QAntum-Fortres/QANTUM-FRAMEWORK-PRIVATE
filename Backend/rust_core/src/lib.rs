use serde::{Deserialize, Serialize};
use std::slice;
use sha2::{Sha512, Digest};
use std::fs::OpenOptions;
use std::io::Write;

pub mod economy;
pub mod telemetry;
pub mod server;

#[derive(Deserialize, Serialize)]
pub struct BioPoint { pub hr: f64, pub oxy: f64 }
#[derive(Deserialize, Serialize)]
pub struct MarketPoint { pub price: f64, pub volume: f64 }
#[derive(Deserialize, Serialize)]
pub struct EnergyData { pub battery_level: f64 }

#[derive(Deserialize, Serialize)]
pub struct InputPayload {
    pub bio_data_stream: Vec<BioPoint>,
    pub market_data_stream: Vec<MarketPoint>,
    pub energy_data_stream: EnergyData,
}

#[no_mangle]
pub extern "C" fn process_and_sign_cycle(data_ptr: *const u8, data_len: usize) -> f64 {
    // Safety checks
    if data_ptr.is_null() || data_len == 0 { return -1.0; }
    let slice = unsafe { slice::from_raw_parts(data_ptr, data_len) };
    let payload: InputPayload = match serde_json::from_slice(slice) {
        Ok(p) => p,
        Err(_) => return -2.0,
    };

    // Core entropy calculation (same logic as before)
    let mut total_entropy = 0.0_f64;
    for bio in &payload.bio_data_stream {
        let b_val = (bio.hr * 0.5) + (bio.oxy * 2.0);
        for market in &payload.market_data_stream {
            let m_val = if market.volume > 0.0 { market.price / market.volume } else { 0.0 };
            if b_val > 50.0 && m_val < 0.001 {
                let multiplier = if payload.energy_data_stream.battery_level < 20.0 { 2.5 } else { 0.1 };
                total_entropy += (b_val * m_val) * multiplier;
            } else if b_val < 20.0 && m_val > 0.05 {
                let golden = (b_val * m_val).sqrt();
                if golden > 1.618 { total_entropy -= golden; } else { total_entropy += 0.01; }
            } else {
                total_entropy += ((b_val.sin()) * (m_val.cos())).abs() * 0.001;
            }
        }
    }
    let final_index = 100.0 - total_entropy.max(0.0).min(100.0);

    // SHA-512 signing and ledger write
    let mut hasher = Sha512::new();
    hasher.update(slice);
    hasher.update(final_index.to_be_bytes());
    let hash = hasher.finalize();
    if let Ok(mut file) = OpenOptions::new().append(true).create(true).open("sovereign.ledger") {
        let _ = writeln!(file, "{:x} | INDEX: {:.4}", hash, final_index);
    }
    final_index
}
