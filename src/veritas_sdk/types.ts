// Core Data Structures mirroring Rust definitions

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    label?: string;
    confidence: number;
}

export interface VisionRequest {
    image_base64: string;
    intent: string;
}

export interface VisionResult {
    found: boolean;
    location: BoundingBox | null;
    candidates: BoundingBox[];
    confidence: number;
    semantic_embedding: number[];
    heatmap_data: number[];
    reasoning: string;
    processing_time_ms: number;
}

export interface HealRequest {
    failed_selector: string;
    last_known_embedding: number[];
    current_image: string;
}

export interface HealResult {
    healed: boolean;
    new_selector: string;
    similarity_score: number;
    reason: string;
    audit_trail: string[];
}

export interface GoalRequest {
    goal: string;
}

export interface AgentStep {
    step_id: number;
    action: string;
    observation: string;
    reasoning: string;
    duration_ms: number;
}

export interface GoalResult {
    success: boolean;
    steps: AgentStep[];
    audit_log_url: string;
}

export interface ObserverRequest {
    url: string;
    pending_network_requests: number;
    dom_mutation_rate: number;
    layout_shifts: number;
}

export interface ObserverState {
    stable: boolean;
    network_idle: boolean;
    layout_shifts_score: number;
    dom_stability_score: number;
    amniotic_state_score: number;
}

export interface SwarmRequest {
    target_url: string;
    agent_count: number;
    regions: string[];
}

export interface SwarmStatus {
    active_agents: number;
    avg_latency: number;
    success_rate: number;
    total_requests: number;
}

export interface VisionCompareRequest {
    image_a_base64: string;
    image_b_base64: string;
}

export interface VisionCompareResult {
    similarity_score: number;
    diff_reason?: string;
}
