export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface VisionRequest {
    image_base64: string;
    intent: string;
}

export interface VisionResult {
    found: boolean;
    location: BoundingBox | null;
    confidence: number;
    semantic_embedding: number[];
    reasoning: string;
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
}

export interface AgentStep {
    action: string;
    observation: string;
    reasoning: string;
    duration_ms: number;
}

export interface GoalRequest {
    goal: string;
    history: AgentStep[];
    current_state_summary: string;
}

export interface GoalResult {
    complete: boolean;
    next_step: AgentStep | null;
    audit_log_entry: string;
}

export interface ObserverRequest {
    url: string;
    layout_shifts: number;
    network_pending: number;
    dom_mutations: number;
    last_interaction_ms: number;
}

export interface ObserverState {
    stable: boolean;
    amniotic_state_score: number;
    recommendation: string;
}

// Legacy export (if used elsewhere)
export interface AgentGoal {
    description: string;
}
