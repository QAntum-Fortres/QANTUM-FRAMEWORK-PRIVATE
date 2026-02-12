/**
 * 🧠 Mobile Cognitive Action Types
 * Action type definitions for mobile cognitive proxy
 */

export enum CognitiveActionType {
  // Existing action types (from Frontend/src/intelligence/)
  AUTONOMOUS_THINK = 'autonomous_think',
  SELF_AUDIT = 'self_audit',
  VERIFY_SYMBOL = 'verify_symbol',
  LOOKUP_MAP = 'lookup_map',
  SELF_HEAL = 'self_heal',
  PATTERN_ANALYSIS = 'pattern_analysis',
  SWARM_TASK = 'swarm_task',
  DECRYPT_VAULT = 'decrypt_vault',
  NETWORK_RECON = 'network_recon',
  SELF_OPTIMIZE = 'self_optimize',
  PREDICT_RISK = 'predict_risk',
  ENGAGE_DEFENSE = 'engage_defense',
  
  // New mobile-specific actions
  RECORD_SCREEN = 'record_screen',
  STOP_RECORDING = 'stop_recording',
  ENCRYPT_RECORDING = 'encrypt_recording',
  DECRYPT_RECORDING = 'decrypt_recording',
  CLEANUP_RECORDINGS = 'cleanup_recordings',
  VERIFY_BIOMETRIC = 'verify_biometric',
}

export interface RecordScreenPayload {
  quality?: 'low' | 'medium' | 'high';
}

export interface StopRecordingPayload {
  saveMetadata?: boolean;
}

export interface CleanupRecordingsPayload {
  forceDelete?: boolean;
}

export interface VerifyBiometricPayload {
  reason?: string;
}

export type CognitiveActionPayload =
  | RecordScreenPayload
  | StopRecordingPayload
  | CleanupRecordingsPayload
  | VerifyBiometricPayload
  | Record<string, unknown>;

export interface CognitiveAction {
  type: CognitiveActionType;
  payload: CognitiveActionPayload;
  department?: string;
  timestamp?: Date;
}

export interface CognitiveActionResult {
  success: boolean;
  data?: unknown;
  error?: string;
  timestamp: Date;
}
