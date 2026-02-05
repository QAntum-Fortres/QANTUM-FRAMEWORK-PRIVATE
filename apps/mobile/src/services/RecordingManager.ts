/**
 * 📹 Recording Manager
 * Manages recording lifecycle, storage, and cleanup
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import { encryptionService } from './EncryptionService';
import {
  RecordingMetadata,
  RecordingConfig,
  DEFAULT_RECORDING_CONFIG,
} from '../types/recording';

class RecordingManager {
  private static instance: RecordingManager;
  private readonly STORAGE_KEY_CONFIG = '@qantum:recording:config';
  private readonly STORAGE_KEY_METADATA = '@qantum:recording:metadata';
  private readonly RECORDINGS_DIR = `${FileSystem.documentDirectory}recordings/`;

  private constructor() {
    this.initializeStorage();
  }

  static getInstance(): RecordingManager {
    if (!RecordingManager.instance) {
      RecordingManager.instance = new RecordingManager();
    }
    return RecordingManager.instance;
  }

  /**
   * Initialize recordings directory
   */
  private async initializeStorage() {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.RECORDINGS_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.RECORDINGS_DIR, {
          intermediates: true,
        });
        console.log('[RecordingManager] Recordings directory created');
      }
    } catch (error) {
      console.error('[RecordingManager] Failed to initialize storage:', error);
    }
  }

  /**
   * Get recording configuration
   */
  async getConfig(): Promise<RecordingConfig> {
    try {
      const configJson = await AsyncStorage.getItem(this.STORAGE_KEY_CONFIG);
      if (configJson) {
        return JSON.parse(configJson);
      }
      return DEFAULT_RECORDING_CONFIG;
    } catch (error) {
      console.error('[RecordingManager] Failed to get config:', error);
      return DEFAULT_RECORDING_CONFIG;
    }
  }

  /**
   * Update recording configuration
   */
  async updateConfig(config: Partial<RecordingConfig>): Promise<void> {
    try {
      const currentConfig = await this.getConfig();
      const newConfig = { ...currentConfig, ...config };
      await AsyncStorage.setItem(this.STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
      console.log('[RecordingManager] Config updated:', newConfig);
    } catch (error) {
      console.error('[RecordingManager] Failed to update config:', error);
      throw error;
    }
  }

  /**
   * Get all recording metadata
   */
  async getAllMetadata(): Promise<RecordingMetadata[]> {
    try {
      const metadataJson = await AsyncStorage.getItem(this.STORAGE_KEY_METADATA);
      if (metadataJson) {
        const metadata = JSON.parse(metadataJson);
        return metadata.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
          expiresAt: new Date(m.expiresAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('[RecordingManager] Failed to get metadata:', error);
      return [];
    }
  }

  /**
   * Save recording metadata
   */
  async saveMetadata(metadata: RecordingMetadata): Promise<void> {
    try {
      const allMetadata = await this.getAllMetadata();
      allMetadata.push(metadata);
      await AsyncStorage.setItem(this.STORAGE_KEY_METADATA, JSON.stringify(allMetadata));
      console.log('[RecordingManager] Metadata saved:', metadata.filename);
    } catch (error) {
      console.error('[RecordingManager] Failed to save metadata:', error);
      throw error;
    }
  }

  /**
   * Generate recording filename with timestamp
   */
  generateFilename(): string {
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\..+/, '');
    return `testcase_${timestamp}.enc`;
  }

  /**
   * Get device ID for watermarking
   */
  async getDeviceId(): Promise<string> {
    try {
      // Use device model name + OS version as device identifier
      const deviceName = Device.modelName || 'Unknown';
      const osVersion = Device.osVersion || 'Unknown';
      return `${deviceName}-${osVersion}`;
    } catch (error) {
      console.error('[RecordingManager] Failed to get device ID:', error);
      return 'Unknown-Device';
    }
  }

  /**
   * Save and encrypt recording
   */
  async saveRecording(
    recordingUri: string,
    duration: number,
    password: string
  ): Promise<RecordingMetadata> {
    try {
      const config = await this.getConfig();
      const filename = this.generateFilename();
      const deviceId = await this.getDeviceId();

      // Encrypt the recording
      const encryptionResult = await encryptionService.encryptFile(recordingUri, password);

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + config.autoDeleteDays);

      // Get file size
      const fileInfo = await FileSystem.getInfoAsync(recordingUri);
      const fileSize = fileInfo.size || 0;

      // Create metadata
      const metadata: RecordingMetadata = {
        id: Date.now().toString(),
        filename,
        encryptedPath: recordingUri,
        timestamp: new Date(),
        duration,
        fileSize,
        deviceId,
        watermarked: config.watermarkEnabled,
        expiresAt,
      };

      // Save metadata
      await this.saveMetadata(metadata);

      console.log(`[RecordingManager] SAVED: ${filename}`);
      return metadata;
    } catch (error) {
      console.error('[RecordingManager] Failed to save recording:', error);
      throw error;
    }
  }

  /**
   * Delete expired recordings
   */
  async cleanupExpiredRecordings(): Promise<number> {
    try {
      const allMetadata = await this.getAllMetadata();
      const now = new Date();
      let deletedCount = 0;

      const activeMetadata: RecordingMetadata[] = [];

      for (const metadata of allMetadata) {
        if (metadata.expiresAt < now) {
          // Delete the recording file
          try {
            await FileSystem.deleteAsync(metadata.encryptedPath, { idempotent: true });
            deletedCount++;
            console.log(`[RecordingManager] Deleted expired: ${metadata.filename}`);
          } catch (error) {
            console.error('[RecordingManager] Failed to delete file:', error);
          }
        } else {
          activeMetadata.push(metadata);
        }
      }

      // Update metadata with only active recordings
      await AsyncStorage.setItem(
        this.STORAGE_KEY_METADATA,
        JSON.stringify(activeMetadata)
      );

      console.log(`[RecordingManager] Cleanup complete: ${deletedCount} recordings deleted`);
      return deletedCount;
    } catch (error) {
      console.error('[RecordingManager] Failed to cleanup recordings:', error);
      return 0;
    }
  }

  /**
   * Get storage usage
   */
  async getStorageUsage(): Promise<{ totalSize: number; count: number }> {
    try {
      const allMetadata = await this.getAllMetadata();
      const totalSize = allMetadata.reduce((sum, m) => sum + m.fileSize, 0);
      return {
        totalSize,
        count: allMetadata.length,
      };
    } catch (error) {
      console.error('[RecordingManager] Failed to get storage usage:', error);
      return { totalSize: 0, count: 0 };
    }
  }
}

export const recordingManager = RecordingManager.getInstance();
