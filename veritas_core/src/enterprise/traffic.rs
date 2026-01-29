use std::collections::{HashMap, VecDeque};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum Tier {
    Sovereign,  // Priority 1: Fast Track
    Enterprise, // Priority 2: Standard
    Starter,    // Priority 3: Best Effort
}

pub struct TieredRateLimiter {
    queues: HashMap<Tier, VecDeque<String>>, // Queue of Request IDs
    max_concurrency: usize,
    active_requests: usize,
}

impl TieredRateLimiter {
    pub fn new(max_concurrency: usize) -> Self {
        let mut queues = HashMap::new();
        queues.insert(Tier::Sovereign, VecDeque::new());
        queues.insert(Tier::Enterprise, VecDeque::new());
        queues.insert(Tier::Starter, VecDeque::new());

        TieredRateLimiter {
            queues,
            max_concurrency,
            active_requests: 0,
        }
    }

    pub fn enqueue(&mut self, request_id: String, tier: Tier) {
        if let Some(queue) = self.queues.get_mut(&tier) {
            queue.push_back(request_id);
        }
    }

    /// Returns the next Request ID to process, strictly adhering to Tier priority.
    /// Sovereign > Enterprise > Starter
    pub fn next(&mut self) -> Option<String> {
        if self.active_requests >= self.max_concurrency {
            return None; // Grid is saturated
        }

        let next_req = if let Some(q) = self.queues.get_mut(&Tier::Sovereign) {
            q.pop_front()
        } else { None };

        if let Some(req) = next_req {
            self.active_requests += 1;
            return Some(req);
        }

        let next_req = if let Some(q) = self.queues.get_mut(&Tier::Enterprise) {
            q.pop_front()
        } else { None };

        if let Some(req) = next_req {
             self.active_requests += 1;
             return Some(req);
        }

        let next_req = if let Some(q) = self.queues.get_mut(&Tier::Starter) {
            q.pop_front()
        } else { None };

        if let Some(req) = next_req {
            self.active_requests += 1;
            return Some(req);
        }

        None
    }

    pub fn release(&mut self) {
        if self.active_requests > 0 {
            self.active_requests -= 1;
        }
    }
}
