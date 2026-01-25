// lwas_core/src/lib.rs
// ARCHITECT: Dimitar Prodromov | STATUS: DIAMOND_STABILITY_RESTORED

pub mod kernel;
pub mod memory;
pub mod neuro;
pub mod noetic;
pub mod noetic_bridge;
pub mod omega;
pub mod organism;
pub mod physics;
pub mod prelude;
pub mod runtime;
pub mod security;
pub mod telemetry;

// Експлицитен суверенитет: Никакви glob imports (*) тук!
pub use crate::memory::vsh::{VectorSpaceHeap, VshEngine, VshVector};
pub use crate::prelude::{SovereignError, SovereignResult};
