/**
 * 🔴 Recording Indicator Component
 * Visual indicator when recording is active
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { RecordingSession, RecordingStatus } from '../types/recording';

interface RecordingIndicatorProps {
  session: RecordingSession | null;
}

export function RecordingIndicator({ session }: RecordingIndicatorProps) {
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    if (session?.status === RecordingStatus.RECORDING) {
      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [session?.status]);

  if (!session || session.status !== RecordingStatus.RECORDING) {
    return null;
  }

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hrs, mins, secs]
      .map(v => v.toString().padStart(2, '0'))
      .join(':');
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.recordingDot,
          { transform: [{ scale: pulseAnim }] },
        ]}
      />
      <Text style={styles.recordingText}>REC</Text>
      <Text style={styles.durationText}>{formatDuration(session.duration)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.5)',
    zIndex: 1000,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff0000',
    marginRight: 8,
  },
  recordingText: {
    color: '#ff0000',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});
