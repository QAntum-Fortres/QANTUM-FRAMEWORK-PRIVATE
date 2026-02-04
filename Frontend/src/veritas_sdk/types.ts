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
    location?: BoundingBox;
    confidence: number;
    semantic_embedding: number[];
    reasoning: string;
}
