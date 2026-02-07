/**
 * 🎥 Screen Recording Types
 * Type definitions for QANTUM HELIOS screen recording service
 */

export enum RecordingStatus {
  IDLE = 'idle',
  REQUESTING_PERMISSION = 'requesting_permission',
  RECORDING = 'recording',
  PAUSED = 'paused',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export enum RecordingQuality {
  LOW = 'low',         // 720p, 30fps
  MEDIUM = 'medium',   // 1080p, 30fps
  HIGH = 'high',       // 1080p, 60fps (S24 Ultra optimized)
}

export interface RecordingConfig {
  quality: RecordingQuality;
  includeAudio: boolean;
  watermarkEnabled: boolean;
  maxRecordingMinutes: number;
  autoDeleteDays: number;
}

export interface RecordingMetadata {
  id: string;
  filename: string;
  encryptedPath: string;
  timestamp: Date;
  duration: number;
  fileSize: number;
  deviceId: string;
  watermarked: boolean;
  expiresAt: Date;
}

export interface RecordingSession {
  id: string;
  status: RecordingStatus;
  startTime: Date | null;
  duration: number;
  error?: string;
}

export interface EncryptionResult {
  encryptedData: string;
  iv: string;
  salt: string;
}

export interface DecryptionParams {
  encryptedData: string;
  iv: string;
  salt: string;
  key: string;
}

export const DEFAULT_RECORDING_CONFIG: RecordingConfig = {
  quality: RecordingQuality.HIGH,
  includeAudio: false,
  watermarkEnabled: true,
  maxRecordingMinutes: 30,
  autoDeleteDays: 7,
};
