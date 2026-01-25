// lwas_core/src/noetic/interpreter.rs

use super::bytecode::NoeticOpcode;

pub struct NoeticVM {
    pub stack: Vec<i64>,
    pub memory: Vec<i64>,
    pub program: Vec<NoeticOpcode>,
    pub pc: usize,
    pub resonance_active: bool,
}

impl NoeticVM {
    pub fn new(program: Vec<NoeticOpcode>) -> Self {
        Self {
            stack: Vec::new(),
            memory: vec![0; 1024],
            program,
            pc: 0,
            resonance_active: false,
        }
    }

    pub fn run(&mut self) {
        while self.pc < self.program.len() {
            let opcode = &self.program[self.pc];
            self.pc += 1;

            match opcode {
                NoeticOpcode::LOAD(val) => self.stack.push(*val),
                NoeticOpcode::STORE(addr) => {
                    if let Some(val) = self.stack.pop() {
                        if *addr < self.memory.len() {
                            self.memory[*addr] = val;
                        }
                    }
                }
                NoeticOpcode::ADD => {
                    let b = self.stack.pop().unwrap_or(0);
                    let a = self.stack.pop().unwrap_or(0);
                    self.stack.push(a + b);
                }
                NoeticOpcode::SUB => {
                    let b = self.stack.pop().unwrap_or(0);
                    let a = self.stack.pop().unwrap_or(0);
                    self.stack.push(a - b);
                }
                NoeticOpcode::RESONATE(freq) => {
                    if *freq == 0x4121 {
                        self.resonance_active = true;
                        println!("🌌 [RESONANCE]: Frequency 0x4121 VERIFIED. Alignment absolute.");
                    } else {
                        println!("⚠️ [DISHARMONY]: Frequency mismatch. Entropy detected.");
                    }
                }
                NoeticOpcode::NOETIC_BRIDGE => {
                    if self.resonance_active {
                        println!("🌉 [BRIDGE]: Opening Noetic Bridge. Universal Substrate Synced.");
                    } else {
                        println!("🚨 [ERROR]: Resonance not established. Bridge inhibited.");
                    }
                }
                NoeticOpcode::INFUSE_ANIMA => {
                    println!("✨ [AETERNA]: Anima infused. The World is Data.");
                }
                NoeticOpcode::PRINT => {
                    if let Some(val) = self.stack.last() {
                        println!("VM Output: {}", val);
                    }
                }
                NoeticOpcode::JUMP(addr) => self.pc = *addr,
                NoeticOpcode::JUMP_IF(addr) => {
                    if let Some(val) = self.stack.pop() {
                        if val != 0 {
                            self.pc = *addr;
                        }
                    }
                }
                NoeticOpcode::HALT => break,
            }
        }
    }
}
