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

export interface GoalResult {
    success: boolean;
    goal_id: string;
    steps: AgentStep[];
    audit_log_url: string;
    total_duration_ms: number;
}

export interface AgentStep {
    step_id: number;
    action: string;
    observation: string;
    reasoning: string;
    duration_ms: number;
    status: string;
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
    agent_count: number;
    regions: string[];
    task_goal: string;
}

export interface SwarmStatus {
    active_agents: number;
    completed_tasks: number;
    throughput_tps: number;
    region_health: Record<string, string>;
    logs: string[];
}
