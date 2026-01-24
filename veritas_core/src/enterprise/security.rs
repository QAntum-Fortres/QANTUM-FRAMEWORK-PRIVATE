use serde::{Deserialize, Serialize};
use std::collections::HashSet;

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq, Hash, Clone)]
pub enum Role {
    Admin,
    Auditor,
    Agent,
    Viewer,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UserContext {
    pub user_id: String,
    pub roles: HashSet<Role>,
    pub auth_token: String,
}

pub struct RBAC {
    // In a real system, this would fetch policies from a DB
}

impl RBAC {
    pub fn new() -> Self {
        RBAC {}
    }

    pub fn authorize(&self, user: &UserContext, required_role: Role) -> bool {
        // Admin has all permissions
        if user.roles.contains(&Role::Admin) {
            return true;
        }
        user.roles.contains(&required_role)
    }
}

pub struct AuditLogger {
    // Mock encryption key
    key: String,
}

impl AuditLogger {
    pub fn new() -> Self {
        AuditLogger {
            key: "ENTERPRISE_AES_256_KEY".to_string(),
        }
    }

    pub fn log(&self, event: &str, user: &UserContext) -> String {
        // SIMULATION: Encrypting the log entry
        // In reality, use `aes-gcm` crate.
        format!(
            "[ENCRYPTED-AES256] TIMESTAMP={} USER={} EVENT={} SIG={}",
            chrono::Utc::now(),
            user.user_id,
            event,
            self.sign(event)
        )
    }

    fn sign(&self, data: &str) -> String {
        // Mock HMAC signature
        let mut sum = 0;
        for b in data.bytes() { sum += b as u32; }
        format!("{:x}", sum ^ 0xDEADBEEF)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rbac_admin_override() {
        let rbac = RBAC::new();
        let mut roles = HashSet::new();
        roles.insert(Role::Admin);
        let user = UserContext {
            user_id: "admin1".to_string(),
            roles,
            auth_token: "valid".to_string(),
        };

        assert!(rbac.authorize(&user, Role::Auditor));
    }

    #[test]
    fn test_audit_log_format() {
        let logger = AuditLogger::new();
        let mut roles = HashSet::new();
        roles.insert(Role::Viewer);
        let user = UserContext {
            user_id: "viewer1".to_string(),
            roles,
            auth_token: "valid".to_string(),
        };

        let entry = logger.log("AccessDashboard", &user);
        assert!(entry.contains("[ENCRYPTED-AES256]"));
        assert!(entry.contains("viewer1"));
    }
}
