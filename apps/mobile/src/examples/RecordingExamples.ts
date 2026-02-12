/**
 * 🎥 Screen Recording Usage Examples
 * Practical examples for using the screen recording service
 */

import { screenRecordingService } from '../services/ScreenRecordingService';
import { mobileCognitiveProxy } from '../services/MobileCognitiveProxy';
import { recordingManager } from '../services/RecordingManager';
import { CognitiveActionType } from '../types/cognitive';
import { RecordingQuality } from '../types/recording';

// ==========================================
// Example 1: Basic Recording Flow
// ==========================================

async function basicRecordingExample() {
  console.log('Example 1: Basic Recording Flow');
  
  // Start recording
  const started = await screenRecordingService.startRecording();
  if (!started) {
    console.log('Failed to start recording');
    return;
  }
  
  console.log('Recording started! Perform your test case...');
  
  // Simulate test case execution
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Stop recording
  const filename = await screenRecordingService.stopRecording();
  if (filename) {
    console.log(`Recording saved: ${filename}`);
  }
}

// ==========================================
// Example 2: Using Cognitive Actions
// ==========================================

async function cognitiveActionExample() {
  console.log('Example 2: Using Cognitive Actions');
  
  // Start recording via cognitive action
  const startResult = await mobileCognitiveProxy.dispatch({
    type: CognitiveActionType.RECORD_SCREEN,
    payload: {},
  });
  
  if (startResult.success) {
    console.log('Recording started via cognitive action');
    
    // Get current status
    const status = mobileCognitiveProxy.getRecordingStatus();
    console.log('Recording status:', status);
    
    // Simulate test case
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Stop recording via cognitive action
    const stopResult = await mobileCognitiveProxy.dispatch({
      type: CognitiveActionType.STOP_RECORDING,
      payload: {},
    });
    
    if (stopResult.success) {
      console.log('Recording stopped:', stopResult.data.filename);
    }
  }
}

// ==========================================
// Example 3: Configuration Management
// ==========================================

async function configurationExample() {
  console.log('Example 3: Configuration Management');
  
  // Get current configuration
  const config = await recordingManager.getConfig();
  console.log('Current config:', config);
  
  // Update configuration
  await recordingManager.updateConfig({
    quality: RecordingQuality.HIGH,
    autoDeleteDays: 14,
    includeAudio: false,
    watermarkEnabled: true,
    maxRecordingMinutes: 45,
  });
  
  console.log('Configuration updated');
  
  // Via cognitive proxy
  await mobileCognitiveProxy.updateRecordingConfig({
    autoDeleteDays: 30,
  });
  
  console.log('Config updated via proxy');
}

// ==========================================
// Example 4: Storage Management
// ==========================================

async function storageManagementExample() {
  console.log('Example 4: Storage Management');
  
  // Get storage usage
  const usage = await screenRecordingService.getStorageUsage();
  console.log(`Storage: ${usage.count} recordings, ${usage.totalSize} bytes`);
  
  // Get all recordings metadata
  const recordings = await recordingManager.getAllMetadata();
  recordings.forEach(rec => {
    console.log(`- ${rec.filename}`);
    console.log(`  Duration: ${rec.duration}s`);
    console.log(`  Size: ${rec.fileSize} bytes`);
    console.log(`  Expires: ${rec.expiresAt.toISOString()}`);
  });
  
  // Cleanup expired recordings
  const deletedCount = await screenRecordingService.cleanupRecordings();
  console.log(`Cleaned up ${deletedCount} expired recordings`);
}

// Export examples for use in other files
export {
  basicRecordingExample,
  cognitiveActionExample,
  configurationExample,
  storageManagementExample,
};
