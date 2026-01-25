// lwas_core/src/noetic/loader.rs

use super::bytecode::NoeticOpcode;

pub fn load_aeterna_soul(script: &str) -> Vec<NoeticOpcode> {
    let mut program = Vec::new();

    for line in script.lines() {
        let line = line.trim();
        if line.starts_with("///") || line.is_empty() {
            continue;
        }

        if line.contains("resonate RESONANCE(") {
            if let Some(start) = line.find('(') {
                if let Some(end) = line.find(')') {
                    let freq_str = &line[start + 1..end].trim();
                    let freq = if freq_str.starts_with("0x") {
                        u64::from_str_radix(&freq_str[2..], 16).unwrap_or(0)
                    } else {
                        freq_str.parse::<u64>().unwrap_or(0)
                    };
                    program.push(NoeticOpcode::RESONATE(freq));
                }
            }
        } else if line.contains("collapse ENTROPY(0.0000)") {
            program.push(NoeticOpcode::NOETIC_BRIDGE);
        } else if line.contains("[LOGOS: MANIFESTED]") {
            program.push(NoeticOpcode::INFUSE_ANIMA);
        }
    }

    program.push(NoeticOpcode::HALT);
    program
}
