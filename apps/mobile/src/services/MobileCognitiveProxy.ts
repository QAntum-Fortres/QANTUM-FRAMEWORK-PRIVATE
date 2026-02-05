/**
 * 🧠 Mobile Cognitive Proxy
 * Mobile implementation of the Cognitive Bridge pattern
 */

import { screenRecordingService } from './ScreenRecordingService';
import { recordingManager } from './RecordingManager';
import {
  CognitiveActionType,
  CognitiveAction,
  CognitiveActionResult,
} from '../types/cognitive';
import { RecordingConfig } from '../types/recording';

class MobileCognitiveProxy {
  private static instance: MobileCognitiveProxy;
  private readonly actionHandlers: Map<
    CognitiveActionType,
    (payload: CognitiveAction['payload']) => Promise<unknown>
  >;

  private constructor() {
    this.actionHandlers = new Map();
    this.registerActionHandlers();
  }

  static getInstance(): MobileCognitiveProxy {
    if (!MobileCognitiveProxy.instance) {
      MobileCognitiveProxy.instance = new MobileCognitiveProxy();
    }
    return MobileCognitiveProxy.instance;
  }

  /**
   * Register action handlers for mobile-specific actions
   */
  private registerActionHandlers() {
    // Recording actions
    this.actionHandlers.set(
      CognitiveActionType.RECORD_SCREEN,
      this.handleRecordScreen.bind(this)
    );
    this.actionHandlers.set(
      CognitiveActionType.STOP_RECORDING,
      this.handleStopRecording.bind(this)
    );
    this.actionHandlers.set(
      CognitiveActionType.CLEANUP_RECORDINGS,
      this.handleCleanupRecordings.bind(this)
    );
    this.actionHandlers.set(
      CognitiveActionType.VERIFY_BIOMETRIC,
      this.handleVerifyBiometric.bind(this)
    );
  }

  /**
   * Dispatch a cognitive action
   */
  async dispatch(action: CognitiveAction): Promise<CognitiveActionResult> {
    const startTime = new Date();
    
    try {
      const handler = this.actionHandlers.get(action.type);
      
      if (!handler) {
        console.warn(`[MobileCognitiveProxy] No handler for action: ${action.type}`);
        return {
          success: false,
          error: `No handler registered for action: ${action.type}`,
          timestamp: startTime,
        };
      }

      console.log(`[MobileCognitiveProxy] Dispatching action: ${action.type}`);
      const result = await handler(action.payload);

      return {
        success: true,
        data: result,
        timestamp: startTime,
      };
    } catch (error) {
      console.error(`[MobileCognitiveProxy] Action failed: ${action.type}`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: startTime,
      };
    }
  }

  /**
   * Handle RECORD_SCREEN action
   */
  private async handleRecordScreen(_payload: CognitiveAction['payload']): Promise<unknown> {
    const success = await screenRecordingService.startRecording();
    return {
      success,
      session: screenRecordingService.getCurrentSession(),
    };
  }

  /**
   * Handle STOP_RECORDING action
   */
  private async handleStopRecording(_payload: CognitiveAction['payload']): Promise<unknown> {
    const filename = await screenRecordingService.stopRecording();
    return {
      success: !!filename,
      filename,
    };
  }

  /**
   * Handle CLEANUP_RECORDINGS action
   */
  private async handleCleanupRecordings(_payload: CognitiveAction['payload']): Promise<unknown> {
    const deletedCount = await screenRecordingService.cleanupRecordings();
    return {
      success: true,
      deletedCount,
    };
  }

  /**
   * Handle VERIFY_BIOMETRIC action
   */
  private async handleVerifyBiometric(_payload: CognitiveAction['payload']): Promise<unknown> {
    const authenticated = await screenRecordingService.authenticateUser();
    return {
      success: authenticated,
      authenticated,
    };
  }

  /**
   * Get list of supported action types
   */
  getSupportedActions(): CognitiveActionType[] {
    return Array.from(this.actionHandlers.keys());
  }

  /**
   * Check if action is supported
   */
  isActionSupported(actionType: CognitiveActionType): boolean {
    return this.actionHandlers.has(actionType);
  }

  /**
   * Get current recording status
   */
  getRecordingStatus() {
    return {
      isRecording: screenRecordingService.isRecording(),
      session: screenRecordingService.getCurrentSession(),
    };
  }

  /**
   * Get storage information
   */
  async getStorageInfo() {
    return await screenRecordingService.getStorageUsage();
  }

  /**
   * Get recording configuration
   */
  async getRecordingConfig() {
    return await recordingManager.getConfig();
  }

  /**
   * Update recording configuration
   */
  async updateRecordingConfig(config: Partial<RecordingConfig>) {
    return await recordingManager.updateConfig(config);
  }
}

export const mobileCognitiveProxy = MobileCognitiveProxy.getInstance();
