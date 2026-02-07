/**
 * 🎬 Screen Recording Service
 * Main service for screen recording with biometric authentication
 */

import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Platform } from 'react-native';
import { recordingManager } from './RecordingManager';
import {
  RecordingStatus,
  RecordingSession,
  RecordingConfig,
} from '../types/recording';

class ScreenRecordingService {
  private static instance: ScreenRecordingService;
  private currentSession: RecordingSession | null = null;
  private sessionTimer: ReturnType<typeof setInterval> | null = null;
  private isAuthenticated = false;

  private constructor() {}

  static getInstance(): ScreenRecordingService {
    if (!ScreenRecordingService.instance) {
      ScreenRecordingService.instance = new ScreenRecordingService();
    }
    return ScreenRecordingService.instance;
  }

  /**
   * Check if device supports biometric authentication
   */
  async checkBiometricSupport(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch (error) {
      console.error('[ScreenRecordingService] Biometric check failed:', error);
      return false;
    }
  }

  /**
   * Authenticate user with biometrics
   */
  async authenticateUser(): Promise<boolean> {
    try {
      const hasSupport = await this.checkBiometricSupport();
      
      if (!hasSupport) {
        Alert.alert(
          'Biometric Not Available',
          'Please set up biometric authentication on your device to use screen recording.'
        );
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to start screen recording',
        fallbackLabel: 'Use passcode',
        disableDeviceFallback: false,
      });

      this.isAuthenticated = result.success;
      
      if (!result.success) {
        Alert.alert('Authentication Failed', 'Please try again.');
      }

      return result.success;
    } catch (error) {
      console.error('[ScreenRecordingService] Authentication failed:', error);
      Alert.alert('Authentication Error', 'Failed to authenticate. Please try again.');
      return false;
    }
  }

  /**
   * Get current recording session
   */
  getCurrentSession(): RecordingSession | null {
    return this.currentSession;
  }

  /**
   * Check if currently recording
   */
  isRecording(): boolean {
    return this.currentSession?.status === RecordingStatus.RECORDING;
  }

  /**
   * Start screen recording
   */
  async startRecording(): Promise<boolean> {
    try {
      // Check authentication
      if (!this.isAuthenticated) {
        const authenticated = await this.authenticateUser();
        if (!authenticated) {
          return false;
        }
      }

      // Check if already recording
      if (this.isRecording()) {
        Alert.alert('Already Recording', 'Please stop the current recording first.');
        return false;
      }

      // Get recording config
      const config = await recordingManager.getConfig();

      // Create new session
      this.currentSession = {
        id: Date.now().toString(),
        status: RecordingStatus.RECORDING,
        startTime: new Date(),
        duration: 0,
      };

      // Start duration timer
      this.startDurationTimer();

      console.log('[ScreenRecordingService] Recording started:', this.currentSession.id);

      // Note: Actual screen recording implementation would happen here
      // This would involve native modules for MediaProjection on Android
      // For now, this is a placeholder that tracks the session state

      return true;
    } catch (error) {
      console.error('[ScreenRecordingService] Failed to start recording:', error);
      this.currentSession = {
        id: Date.now().toString(),
        status: RecordingStatus.ERROR,
        startTime: null,
        duration: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
      return false;
    }
  }

  /**
   * Stop screen recording
   */
  async stopRecording(): Promise<string | null> {
    try {
      if (!this.currentSession || !this.isRecording()) {
        Alert.alert('No Active Recording', 'There is no active recording to stop.');
        return null;
      }

      // Stop duration timer
      this.stopDurationTimer();

      // Update session status
      this.currentSession.status = RecordingStatus.PROCESSING;

      console.log('[ScreenRecordingService] Recording stopped, processing...');

      // Note: Actual recording file would be saved here
      // For now, we'll create a mock recording URI
      const mockRecordingUri = `${Date.now()}_recording.mp4`;
      const duration = this.currentSession.duration;

      // Save and encrypt recording
      // TODO: Use device-specific secure key from hardware-backed keystore
      // For production, integrate with expo-secure-store or Android Keystore
      const deviceSecureKey = await this.getDeviceSecureKey();
      const metadata = await recordingManager.saveRecording(
        mockRecordingUri,
        duration,
        deviceSecureKey
      );

      // Update session status
      this.currentSession.status = RecordingStatus.COMPLETED;

      console.log(`[RECORDING] SAVED: ${metadata.filename}`);

      // Reset session
      this.currentSession = null;
      this.isAuthenticated = false;

      return metadata.filename;
    } catch (error) {
      console.error('[ScreenRecordingService] Failed to stop recording:', error);
      if (this.currentSession) {
        this.currentSession.status = RecordingStatus.ERROR;
        this.currentSession.error = error instanceof Error ? error.message : 'Unknown error';
      }
      Alert.alert('Recording Error', 'Failed to save recording. Please try again.');
      return null;
    }
  }

  /**
   * Get device-specific secure encryption key
   * Uses device UUID and hardware-backed storage
   */
  private async getDeviceSecureKey(): Promise<string> {
    // TODO: In production, use expo-secure-store or Android Keystore
    // This is a placeholder that should be replaced with proper implementation
    // Example: await SecureStore.getItemAsync('qantum-recording-key')
    const deviceId = await recordingManager.getDeviceId();
    return `qantum-${deviceId}-secure-key`;
  }

  /**
   * Start duration timer
   */
  private startDurationTimer() {
    this.sessionTimer = setInterval(() => {
      if (this.currentSession && this.currentSession.startTime) {
        const now = new Date();
        this.currentSession.duration = Math.floor(
          (now.getTime() - this.currentSession.startTime.getTime()) / 1000
        );

        // Check max duration
        this.checkMaxDuration();
      }
    }, 1000);
  }

  /**
   * Stop duration timer
   */
  private stopDurationTimer() {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  /**
   * Check if max recording duration reached
   */
  private async checkMaxDuration() {
    if (!this.currentSession) return;

    const config = await recordingManager.getConfig();
    const maxSeconds = config.maxRecordingMinutes * 60;

    if (this.currentSession.duration >= maxSeconds) {
      Alert.alert(
        'Max Duration Reached',
        `Recording will stop automatically after ${config.maxRecordingMinutes} minutes.`,
        [
          {
            text: 'OK',
            onPress: () => this.stopRecording(),
          },
        ]
      );
    }
  }

  /**
   * Format duration as HH:MM:SS
   */
  formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hrs, mins, secs]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  }

  /**
   * Cleanup expired recordings
   */
  async cleanupRecordings(): Promise<number> {
    return await recordingManager.cleanupExpiredRecordings();
  }

  /**
   * Get storage usage
   */
  async getStorageUsage() {
    return await recordingManager.getStorageUsage();
  }
}

export const screenRecordingService = ScreenRecordingService.getInstance();
