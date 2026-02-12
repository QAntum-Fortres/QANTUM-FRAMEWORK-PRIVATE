# 🎥 QANTUM HELIOS Screen Recording Service

## Overview
Secure background screen recording service for QA test case documentation on Samsung S24 Ultra devices.

## Features

### ✅ Core Functionality
- **Background Screen Recording**: Capture screen content with minimal UI footprint
- **High Quality**: 1080p60 recording optimized for S24 Ultra hardware
- **Biometric Authentication**: Secure access using device biometrics
- **AES-256 Encryption**: All recordings encrypted at rest
- **Auto-Delete**: Configurable retention period (default: 7 days)
- **Watermarking**: Timestamp and device ID for audit trail
- **Secure Storage**: App-private directory, no external access

### 🔐 Security & Privacy
- Biometric authentication required before recording
- Encrypted storage using AES-256-CBC
- Auto-delete after configurable time period
- Watermarked recordings for audit compliance
- Local-only storage (no cloud sync)
- Clear visual indicators when recording

## Architecture

### Service Layer
```
src/services/
├── ScreenRecordingService.ts    # Main recording service
├── RecordingManager.ts           # Lifecycle & storage management
├── EncryptionService.ts          # AES-256 encryption/decryption
└── MobileCognitiveProxy.ts       # Action dispatch integration
```

### Type Definitions
```
src/types/
├── recording.ts                  # Recording types & interfaces
└── cognitive.ts                  # Cognitive action types
```

### UI Components
```
src/components/
└── RecordingIndicator.tsx        # Visual recording indicator
```

## Usage

### 1. Start Recording
Tap the "SECURE RECORD" card on the dashboard:
- System prompts for biometric authentication
- Request screen recording permission (MediaProjection)
- Foreground service starts with notification
- Recording indicator appears in top-right corner

### 2. Stop Recording
Tap the "SECURE RECORD" card again:
- Recording stops and begins processing
- File is encrypted using AES-256
- Metadata saved to AsyncStorage
- Success alert shown with filename

### 3. Configuration
Modify recording settings via AsyncStorage:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const config = {
  recordingQuality: 'high',      // 'low' | 'medium' | 'high'
  autoDeleteDays: 7,              // Days until auto-delete
  includeAudio: false,            // Include microphone audio
  watermarkEnabled: true,         // Add timestamp watermark
  maxRecordingMinutes: 30         // Maximum recording duration
};

await AsyncStorage.setItem(
  '@qantum:recording:config',
  JSON.stringify(config)
);
```

## API Reference

### ScreenRecordingService

```typescript
import { screenRecordingService } from './services/ScreenRecordingService';

// Check biometric support
const hasSupport = await screenRecordingService.checkBiometricSupport();

// Authenticate user
const authenticated = await screenRecordingService.authenticateUser();

// Start recording
const success = await screenRecordingService.startRecording();

// Stop recording
const filename = await screenRecordingService.stopRecording();

// Get current session
const session = screenRecordingService.getCurrentSession();

// Check if recording
const isRecording = screenRecordingService.isRecording();

// Cleanup expired recordings
const deletedCount = await screenRecordingService.cleanupRecordings();

// Get storage usage
const { totalSize, count } = await screenRecordingService.getStorageUsage();
```

### RecordingManager

```typescript
import { recordingManager } from './services/RecordingManager';

// Get configuration
const config = await recordingManager.getConfig();

// Update configuration
await recordingManager.updateConfig({ autoDeleteDays: 14 });

// Get all recordings metadata
const recordings = await recordingManager.getAllMetadata();

// Save recording
const metadata = await recordingManager.saveRecording(
  recordingUri,
  duration,
  password
);

// Cleanup expired recordings
const deletedCount = await recordingManager.cleanupExpiredRecordings();
```

### EncryptionService

```typescript
import { encryptionService } from './services/EncryptionService';

// Encrypt data
const result = await encryptionService.encrypt(data, password);
// Returns: { encryptedData, iv, salt }

// Decrypt data
const decryptedData = await encryptionService.decrypt({
  encryptedData,
  iv,
  salt,
  key: password
});

// Encrypt file
const result = await encryptionService.encryptFile(fileUri, password);

// Decrypt file
const fileUri = await encryptionService.decryptFile({
  encryptedData,
  iv,
  salt,
  key: password
});
```

### MobileCognitiveProxy

```typescript
import { mobileCognitiveProxy } from './services/MobileCognitiveProxy';
import { CognitiveActionType } from './types/cognitive';

// Dispatch action
const result = await mobileCognitiveProxy.dispatch({
  type: CognitiveActionType.RECORD_SCREEN,
  payload: {}
});

// Get supported actions
const actions = mobileCognitiveProxy.getSupportedActions();

// Check if action is supported
const isSupported = mobileCognitiveProxy.isActionSupported(
  CognitiveActionType.RECORD_SCREEN
);

// Get recording status
const status = mobileCognitiveProxy.getRecordingStatus();

// Get storage info
const info = await mobileCognitiveProxy.getStorageInfo();
```

## Android Native Implementation

See [ANDROID_NATIVE_IMPLEMENTATION.md](./ANDROID_NATIVE_IMPLEMENTATION.md) for detailed Android setup instructions.

### Quick Setup
1. Add permissions to `AndroidManifest.xml`
2. Create native modules in `android/app/src/main/java/`
3. Register package in `MainApplication.java`
4. Rebuild Android project

## Dependencies

```json
{
  "expo-local-authentication": "~14.0.1",
  "@react-native-async-storage/async-storage": "~2.1.0",
  "expo-av": "~15.0.3",
  "expo-media-library": "~18.0.4",
  "expo-file-system": "~18.0.8",
  "react-native-aes-crypto": "^2.1.0",
  "lucide-react-native": "^0.460.0",
  "react-native-svg": "15.9.0"
}
```

## Recording Quality Settings

| Quality | Resolution | FPS | Bitrate | Codec |
|---------|-----------|-----|---------|-------|
| LOW     | 720p      | 30  | 4 Mbps  | H.264 |
| MEDIUM  | 1080p     | 30  | 8 Mbps  | H.264 |
| HIGH    | 1080p     | 60  | 16 Mbps | H.265 |

## Storage Management

### File Structure
```
<App Documents>/recordings/
├── testcase_20260205_110430.enc    # Encrypted recording
├── testcase_20260205_113015.enc
└── ...
```

### Metadata Storage
```typescript
interface RecordingMetadata {
  id: string;
  filename: string;
  encryptedPath: string;
  timestamp: Date;
  duration: number;          // seconds
  fileSize: number;          // bytes
  deviceId: string;          // Device identifier
  watermarked: boolean;
  expiresAt: Date;          // Auto-delete date
}
```

Metadata is stored in AsyncStorage at key: `@qantum:recording:metadata`

## Compliance & Ethics

### Purpose
- QA test case documentation only
- Professional work documentation
- Audit trail for test execution

### Data Handling
- All recordings stored locally
- Encrypted at rest (AES-256)
- Auto-delete after retention period
- No cloud upload or external access

### User Control
- Explicit start/stop required
- Clear visual indicators
- Biometric authentication
- User-configurable retention

### Transparency
- Watermarked with timestamp
- Device ID for audit trail
- Recording logs in system logs
- Clear notification when recording

## Security Considerations

### Encryption
- **Algorithm**: AES-256-CBC
- **Key Derivation**: PBKDF2 (10,000 iterations)
- **Random Salt**: 16 bytes
- **Random IV**: 16 bytes per encryption

### Authentication
- Biometric authentication (fingerprint/face)
- Device passcode fallback
- Session-based authentication
- No persistent authentication state

### Storage
- App-private directory only
- No external storage access
- No media gallery access
- Encrypted at rest

## Troubleshooting

### Biometric Authentication Failed
- Ensure device has biometric authentication enabled
- Check Settings > Security > Biometric
- Verify passcode is set up

### Recording Permission Denied
- Grant screen recording permission when prompted
- On Android 14+, ensure app has notification permission
- Restart app if permission dialog doesn't appear

### Recording Not Starting
- Check device storage space
- Verify biometric authentication completed
- Ensure no other recording is in progress
- Check app has necessary permissions

### File Not Encrypted
- Verify `react-native-aes-crypto` is properly installed
- Check encryption service logs
- Ensure proper password is provided

## Testing Checklist

- [ ] Biometric authentication flow
- [ ] MediaProjection permission request
- [ ] Recording start/stop functionality
- [ ] Recording indicator visibility
- [ ] Encryption/decryption cycle
- [ ] Foreground service persistence
- [ ] Auto-delete mechanism
- [ ] Storage usage calculation
- [ ] Configuration persistence
- [ ] S24 Ultra hardware optimization

## Known Limitations

1. **Platform**: Android only (iOS has different APIs)
2. **Protected Content**: Cannot record DRM-protected content
3. **System Indicator**: Recording indicator is system-managed
4. **Storage**: Limited by device available storage
5. **Battery**: Extended recording impacts battery life

## Future Enhancements

- [ ] Pause/resume functionality
- [ ] Custom overlay watermarking
- [ ] Cloud backup (encrypted)
- [ ] Multiple quality profiles
- [ ] Screen annotation during recording
- [ ] Scheduled auto-cleanup
- [ ] Export to encrypted ZIP
- [ ] Recording playback in-app

## Support

For issues or questions:
1. Check [ANDROID_NATIVE_IMPLEMENTATION.md](./ANDROID_NATIVE_IMPLEMENTATION.md)
2. Review system logs for error messages
3. Verify all dependencies are installed
4. Ensure Android native modules are built

## License

This is proprietary software for QA testing purposes. All rights reserved.
