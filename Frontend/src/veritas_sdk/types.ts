export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface VisionRequest {
    image_base64: string;
    intent: string; // e.g., "Find the Checkout button"
}

export interface VisionResult {
    found: boolean;
    location?: BoundingBox;
    confidence: number;
    semantic_embedding: number[];
    reasoning: string;
}

export interface GoalRequest {
    goal: string;
}

export interface AgentStep {
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

export interface CommandPayload<T> {
    command: string;
    payload: T;
}

export interface SecureCommand {
    auth_token: string;
    user_id: string;
    command: CommandPayload<any>;
}
