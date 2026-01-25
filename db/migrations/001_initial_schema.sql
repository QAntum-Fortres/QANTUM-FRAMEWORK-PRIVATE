-- ═══════════════════════════════════════════════════════════════════════════════
-- 🌌 VORTEX GENESIS - DATABASE SCHEMA MIGRATION
-- ═══════════════════════════════════════════════════════════════════════════════
-- Migration: 001_initial_schema.sql
-- Purpose: ApoptosisModule vitality tracking and metabolic entropy management
-- Author: VORTEX Autonomous Immune System
-- Date: 2026-01-14
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 🧬 MODULE VITALITY TABLE
-- ─────────────────────────────────────────────────────────────────────────────
-- Tracks the "lifespan" of each module in the system
-- Entropy accumulates over time; LivenessTokens reset it to prevent premature death
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS module_vitality (
    -- Unique identifier for the module (e.g., 'SovereignSalesHealer', 'VortexNexus')
    module_id TEXT PRIMARY KEY,
    
    -- Last time the module registered vitality (via LivenessToken)
    -- Used to calculate staleness and entropy accumulation
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Metabolic entropy score (0.0 = healthy, 100.0 = ready for apoptosis)
    -- Increases over time based on inactivity and errors
    -- Reset to 0.0 when valid LivenessToken is registered
    entropy_score FLOAT DEFAULT 0.0 CHECK (entropy_score >= 0.0 AND entropy_score <= 100.0),
    
    -- Last received LivenessToken (for audit trail)
    -- Format: moduleId:timestamp:status:signature
    liveness_token TEXT,
    
    -- Current health status
    -- Values: 'HEALTHY', 'RECOVERING', 'DEGRADED', 'CRITICAL', 'ARCHIVED'
    status TEXT DEFAULT 'HEALTHY' CHECK (status IN ('HEALTHY', 'RECOVERING', 'DEGRADED', 'CRITICAL', 'ARCHIVED')),
    
    -- Number of successful healing operations performed on this module
    healing_count INTEGER DEFAULT 0,
    
    -- Number of failed healing attempts
    failed_healing_count INTEGER DEFAULT 0,
    
    -- Timestamp when the module was first registered
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Timestamp when the module was last updated
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 📊 INDEXES FOR PERFORMANCE
-- ─────────────────────────────────────────────────────────────────────────────

-- Index for querying modules by status (e.g., finding all CRITICAL modules)
CREATE INDEX IF NOT EXISTS idx_module_vitality_status ON module_vitality(status);

-- Index for querying stale modules (last_active + entropy_score)
CREATE INDEX IF NOT EXISTS idx_module_vitality_staleness ON module_vitality(last_active, entropy_score);

-- Index for entropy-based queries (finding modules close to apoptosis threshold)
CREATE INDEX IF NOT EXISTS idx_module_vitality_entropy ON module_vitality(entropy_score DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 💀 GRAVEYARD TABLE (Archived Modules)
-- ─────────────────────────────────────────────────────────────────────────────
-- Stores modules that have undergone programmed death (apoptosis)
-- Allows for forensic analysis and potential resurrection
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS module_graveyard (
    -- Unique identifier for the archived module
    module_id TEXT PRIMARY KEY,
    
    -- Final entropy score at time of death
    final_entropy_score FLOAT,
    
    -- Final status before archival
    final_status TEXT,
    
    -- Reason for apoptosis (e.g., 'STALENESS', 'CRITICAL_ENTROPY', 'MANUAL')
    death_reason TEXT,
    
    -- Timestamp when the module was last active
    last_active TIMESTAMP WITH TIME ZONE,
    
    -- Timestamp when the module was archived
    archived_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Snapshot of module metadata (JSON)
    metadata JSONB,
    
    -- Flag indicating if the module can be resurrected
    resurrectable BOOLEAN DEFAULT TRUE
);

-- Index for querying by death reason
CREATE INDEX IF NOT EXISTS idx_graveyard_death_reason ON module_graveyard(death_reason);

-- Index for querying by archival date
CREATE INDEX IF NOT EXISTS idx_graveyard_archived_at ON module_graveyard(archived_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- 🔬 HEALING HISTORY TABLE
-- ─────────────────────────────────────────────────────────────────────────────
-- Audit log of all healing operations performed by VortexHealingNexus
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS healing_history (
    -- Unique identifier for the healing event
    id SERIAL PRIMARY KEY,
    
    -- Module that was healed
    module_id TEXT NOT NULL,
    
    -- Healing domain (UI, Network, Logic, Database)
    domain TEXT NOT NULL CHECK (domain IN ('UI', 'Network', 'Logic', 'Database')),
    
    -- Healing strategy used (e.g., 'NeuralMapEngine', 'HydraNetwork')
    strategy TEXT,
    
    -- Success or failure
    success BOOLEAN NOT NULL,
    
    -- Error message if healing failed
    error_message TEXT,
    
    -- Duration of healing operation in milliseconds
    duration_ms INTEGER,
    
    -- Timestamp when healing was initiated
    healed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Healing context (JSON snapshot of error/context)
    context JSONB
);

-- Index for querying healing history by module
CREATE INDEX IF NOT EXISTS idx_healing_history_module ON healing_history(module_id, healed_at DESC);

-- Index for querying by domain
CREATE INDEX IF NOT EXISTS idx_healing_history_domain ON healing_history(domain);

-- Index for querying failed healings
CREATE INDEX IF NOT EXISTS idx_healing_history_failures ON healing_history(success) WHERE success = FALSE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 🔄 AUTOMATIC TIMESTAMP UPDATE TRIGGER
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_module_vitality_updated_at
    BEFORE UPDATE ON module_vitality
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────────────────────
-- 📊 INITIAL SEED DATA (Optional)
-- ─────────────────────────────────────────────────────────────────────────────

-- Register core system modules with initial HEALTHY status
INSERT INTO module_vitality (module_id, status, entropy_score) VALUES
    ('VortexHealingNexus', 'HEALTHY', 0.0),
    ('ApoptosisModule', 'HEALTHY', 0.0),
    ('SovereignSalesHealer', 'HEALTHY', 0.0),
    ('NeuralMapEngine', 'HEALTHY', 0.0),
    ('HydraNetwork', 'HEALTHY', 0.0),
    ('EvolutionaryHardening', 'HEALTHY', 0.0),
    ('MetaLogicEngine', 'HEALTHY', 0.0),
    ('ConsensusProtocol', 'HEALTHY', 0.0)
ON CONFLICT (module_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION COMPLETE
-- ═══════════════════════════════════════════════════════════════════════════════
-- Run with: psql -U vortex_admin -d vortex_core -f db/migrations/001_initial_schema.sql
-- Verify: SELECT * FROM module_vitality;
-- ═══════════════════════════════════════════════════════════════════════════════
