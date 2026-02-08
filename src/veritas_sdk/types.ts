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
    audit_trail: string[];
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

export interface AgentGoal {
    description: string;
}

export interface AgentStep {
    action: string;
    observation: string;
    reasoning: string;
    duration_ms: number;
}
