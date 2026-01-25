use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use pbkdf2::pbkdf2_hmac;
use sha2::Sha256;
use thiserror::Error;
use rand::{RngCore, thread_rng};
use base64::{Engine as _, engine::general_purpose};

#[derive(Error, Debug)]
pub enum FortressError {
    #[error("Encryption failure")]
    EncryptionError,
    #[error("Decryption failure")]
    DecryptionError,
    #[error("Invalid password")]
    InvalidPassword,
}

pub struct FortressProtocol {
    iterations: u32,
}

impl FortressProtocol {
    pub fn new() -> Self {
        Self { iterations: 100_000 }
    }

    pub fn derive_key(&self, password: &str, salt: &[u8]) -> [u8; 32] {
        let mut key = [0u8; 32];
        pbkdf2_hmac::<Sha256>(password.as_bytes(), salt, self.iterations, &mut key);
        key
    }

    pub fn encrypt(&self, plaintext: &str, password: &str) -> Result<String, FortressError> {
        let mut salt = [0u8; 32];
        let mut nonce_bytes = [0u8; 12];
        thread_rng().fill_bytes(&mut salt);
        thread_rng().fill_bytes(&mut nonce_bytes);

        let key = self.derive_key(password, &salt);
        let cipher = Aes256Gcm::new_from_slice(&key).map_err(|_| FortressError::EncryptionError)?;
        let nonce = Nonce::from_slice(&nonce_bytes);

        let ciphertext = cipher
            .encrypt(nonce, plaintext.as_bytes())
            .map_err(|_| FortressError::EncryptionError)?;

        let mut result = salt.to_vec();
        result.extend_from_slice(&nonce_bytes);
        result.extend_from_slice(&ciphertext);

        Ok(general_purpose::STANDARD.encode(result))
    }

    pub fn decrypt(&self, encoded_data: &str, password: &str) -> Result<String, FortressError> {
        let data = general_purpose::STANDARD.decode(encoded_data).map_err(|_| FortressError::DecryptionError)?;
        if data.len() < 44 { return Err(FortressError::DecryptionError); }

        let salt = &data[0..32];
        let nonce_bytes = &data[32..44];
        let ciphertext = &data[44..];

        let key = self.derive_key(password, salt);
        let cipher = Aes256Gcm::new_from_slice(&key).map_err(|_| FortressError::DecryptionError)?;
        let nonce = Nonce::from_slice(nonce_bytes);

        let plaintext = cipher
            .decrypt(nonce, ciphertext)
            .map_err(|_| FortressError::DecryptionError)?;

        String::from_utf8(plaintext).map_err(|_| FortressError::DecryptionError)
    }
}
