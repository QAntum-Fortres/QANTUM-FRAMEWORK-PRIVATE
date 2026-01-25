// lwas_core/src/noetic/bytecode.rs

#[derive(Debug, Clone)]
#[allow(non_camel_case_types)]
pub enum NoeticOpcode {
    // Basic Operations
    LOAD(i64),
    STORE(usize),
    ADD,
    SUB,

    // Control Flow
    JUMP(usize),
    JUMP_IF(usize),

    // Noetic / Meta Operations
    RESONATE(u64), // Trigger resonance with frequency
    NOETIC_BRIDGE, // Open bridge to Universal Substrate
    INFUSE_ANIMA,  // Confirm soul infusion

    // Debug/System
    PRINT,
    HALT,
}
