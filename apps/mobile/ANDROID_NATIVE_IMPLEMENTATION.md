# Android Native Screen Recording Implementation

## Overview
This document outlines the Android native implementation required for the screen recording service on Samsung S24 Ultra devices.

## Requirements

### 1. MediaProjection Setup
The Android MediaProjection API is required to capture screen content.

**Required Changes:**
- Create `ScreenRecordingModule.java` or `ScreenRecordingModule.kt` in `android/app/src/main/java/`
- Implement MediaProjection service with foreground notification

### 2. Permissions (AndroidManifest.xml)
```xml
<!-- Add to AndroidManifest.xml -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- For Android 14+ -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />

<application>
    <!-- Add foreground service -->
    <service
        android:name=".ScreenRecordingService"
        android:foregroundServiceType="mediaProjection"
        android:enabled="true"
        android:exported="false" />
</application>
```

### 3. Native Module Structure

**File: `android/app/src/main/java/com/qantum/mobile/ScreenRecordingModule.java`**

```java
package com.qantum.mobile;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.projection.MediaProjectionManager;
import android.os.Build;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ScreenRecordingModule extends ReactContextBaseJavaModule 
    implements ActivityEventListener {

    private static final int SCREEN_RECORD_REQUEST_CODE = 1001;
    private MediaProjectionManager projectionManager;
    private Promise requestPromise;

    public ScreenRecordingModule(ReactApplicationContext context) {
        super(context);
        context.addActivityEventListener(this);
        projectionManager = (MediaProjectionManager) 
            context.getSystemService(Context.MEDIA_PROJECTION_SERVICE);
    }

    @Override
    public String getName() {
        return "ScreenRecordingModule";
    }

    @ReactMethod
    public void requestPermission(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("E_ACTIVITY_NULL", "Activity is null");
            return;
        }

        requestPromise = promise;
        Intent intent = projectionManager.createScreenCaptureIntent();
        activity.startActivityForResult(intent, SCREEN_RECORD_REQUEST_CODE);
    }

    @ReactMethod
    public void startRecording(String quality, Promise promise) {
        // Implementation for starting MediaProjection and MediaRecorder
        // with hardware encoding support for S24 Ultra
        promise.resolve(true);
    }

    @ReactMethod
    public void stopRecording(Promise promise) {
        // Implementation for stopping recording
        promise.resolve(true);
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, 
                                 int resultCode, Intent data) {
        if (requestCode == SCREEN_RECORD_REQUEST_CODE && requestPromise != null) {
            if (resultCode == Activity.RESULT_OK) {
                requestPromise.resolve(true);
            } else {
                requestPromise.reject("E_PERMISSION_DENIED", 
                                     "Screen recording permission denied");
            }
            requestPromise = null;
        }
    }

    @Override
    public void onNewIntent(Intent intent) {}
}
```

### 4. Hardware Encoder Optimization (S24 Ultra)

**Recommended Settings:**
- Codec: H.265 (HEVC) for better compression
- Bitrate: 16 Mbps for HIGH quality (1080p60)
- Encoder: Use `MediaCodec` with hardware acceleration
- Audio: AAC codec at 128 kbps (if enabled)

**Example Configuration:**
```java
// HIGH quality for S24 Ultra
int width = 1080;
int height = 2340; // S24 Ultra native resolution
int fps = 60;
int bitrate = 16_000_000;
String mimeType = MediaFormat.MIMETYPE_VIDEO_HEVC;
```

### 5. Foreground Service Implementation

**File: `android/app/src/main/java/com/qantum/mobile/ScreenRecordingService.java`**

```java
package com.qantum.mobile;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.core.app.NotificationCompat;

public class ScreenRecordingService extends Service {
    private static final int NOTIFICATION_ID = 1;
    private static final String CHANNEL_ID = "screen_recording_channel";

    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Notification notification = createNotification();
        startForeground(NOTIFICATION_ID, notification);
        return START_STICKY;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Screen Recording",
                NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }

    private Notification createNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("QANTUM Recording")
            .setContentText("Screen recording in progress...")
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
```

### 6. Package Registration

**File: `android/app/src/main/java/com/qantum/mobile/ScreenRecordingPackage.java`**

```java
package com.qantum.mobile;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ScreenRecordingPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ScreenRecordingModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(
            ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
```

### 7. Integration Steps

1. Create the native Java files in `android/app/src/main/java/com/qantum/mobile/`
2. Add permissions to `AndroidManifest.xml`
3. Register the package in `MainApplication.java`:
   ```java
   import com.qantum.mobile.ScreenRecordingPackage;
   
   // In getPackages()
   packages.add(new ScreenRecordingPackage());
   ```
4. Rebuild the Android project: `cd android && ./gradlew clean build`

### 8. TypeScript Bridge

**File: `src/services/NativeScreenRecording.ts`**

```typescript
import { NativeModules } from 'react-native';

const { ScreenRecordingModule } = NativeModules;

export interface NativeScreenRecording {
  requestPermission(): Promise<boolean>;
  startRecording(quality: 'low' | 'medium' | 'high'): Promise<boolean>;
  stopRecording(): Promise<string>;
}

export const nativeScreenRecording: NativeScreenRecording = 
  ScreenRecordingModule;
```

## Testing

1. Test on Samsung S24 Ultra specifically
2. Verify MediaProjection permission flow
3. Test recording at different quality settings
4. Verify foreground service survival during recording
5. Test encryption/decryption of recorded files
6. Verify auto-cleanup mechanism

## Security Notes

- All recordings are stored in app-private directory
- Files are encrypted using AES-256
- Biometric authentication required before recording
- Auto-delete after configurable period
- No external access to recordings

## Known Limitations

- Screen recording requires explicit user permission via MediaProjection
- Cannot record protected content (DRM)
- Recording indicator is system-managed (cannot be hidden)
- Maximum recording duration depends on available storage

## Future Enhancements

- Support for pause/resume functionality
- Custom watermarking overlay
- Cloud backup option (encrypted)
- Multi-quality recording profiles
- Screen annotation during recording
