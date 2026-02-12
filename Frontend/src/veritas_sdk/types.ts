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
    audit_trail: string[];
}

export interface NeuralMapEntry {
    location: BoundingBox;
    embedding: number[];
    last_seen: number;
}

export interface NeuralMap {
    // Intent -> Entry
    memory: Record<string, NeuralMapEntry>;
}

export interface AgentGoal {
    id: string;
    description: string;
    status: 'pending' | 'active' | 'completed' | 'failed';
    steps: AgentStep[];
}

export interface AgentStep {
    id: string;
    description: string;
    action: string;
    status: 'pending' | 'success' | 'failure';
    result?: string;
}
