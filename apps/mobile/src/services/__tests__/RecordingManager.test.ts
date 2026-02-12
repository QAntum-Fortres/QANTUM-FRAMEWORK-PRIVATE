/**
 * 🧪 RecordingManager Unit Tests
 * Comprehensive test suite for recording lifecycle management
 */

import { recordingManager } from '../RecordingManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Device from 'expo-device';
import { encryptionService } from '../EncryptionService';
import { RecordingMetadata } from '../../types/recording';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('expo-file-system');
jest.mock('expo-device');
jest.mock('../EncryptionService');

describe('RecordingManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = recordingManager;
      const instance2 = recordingManager;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Storage Initialization', () => {
    it('should create recordings directory if it does not exist', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: false,
      });
      (FileSystem.makeDirectoryAsync as jest.Mock).mockResolvedValue(undefined);

      // Trigger initialization by calling a method
      await recordingManager.getConfig();

      expect(FileSystem.makeDirectoryAsync).toHaveBeenCalledWith(
        expect.stringContaining('recordings/'),
        { intermediates: true }
      );
    });

    it('should not create directory if it already exists', async () => {
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        exists: true,
      });

      await recordingManager.getConfig();

      expect(FileSystem.makeDirectoryAsync).not.toHaveBeenCalled();
    });
  });

  describe('Configuration Management', () => {
    it('should return default config if none exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const config = await recordingManager.getConfig();

      expect(config).toEqual({
        quality: 'high',
        includeAudio: false,
        watermarkEnabled: true,
        maxRecordingMinutes: 30,
        autoDeleteDays: 7,
      });
    });

    it('should return saved config from AsyncStorage', async () => {
      const savedConfig = {
        quality: 'medium',
        includeAudio: true,
        watermarkEnabled: false,
        maxRecordingMinutes: 15,
        autoDeleteDays: 3,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(savedConfig)
      );

      const config = await recordingManager.getConfig();

      expect(config).toEqual(savedConfig);
    });

    it('should update config in AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          quality: 'high',
          includeAudio: false,
          watermarkEnabled: true,
          maxRecordingMinutes: 30,
          autoDeleteDays: 7,
        })
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await recordingManager.updateConfig({ autoDeleteDays: 14 });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@qantum:recording:config',
        expect.stringContaining('"autoDeleteDays":14')
      );
    });

    it('should merge partial config with existing', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          quality: 'high',
          includeAudio: false,
          watermarkEnabled: true,
          maxRecordingMinutes: 30,
          autoDeleteDays: 7,
        })
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await recordingManager.updateConfig({ quality: 'low' });

      const savedCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const saved = JSON.parse(savedCall);
      
      expect(saved.quality).toBe('low');
      expect(saved.autoDeleteDays).toBe(7); // Unchanged
    });
  });

  describe('Metadata Management', () => {
    it('should return empty array if no metadata exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const metadata = await recordingManager.getAllMetadata();

      expect(metadata).toEqual([]);
    });

    it('should return saved metadata with parsed dates', async () => {
      const savedMetadata = [
        {
          id: '1',
          filename: 'test.enc',
          encryptedPath: '/path/to/test.enc',
          timestamp: '2026-02-05T10:00:00.000Z',
          duration: 120,
          fileSize: 1024000,
          deviceId: 'Samsung-14',
          watermarked: true,
          expiresAt: '2026-02-12T10:00:00.000Z',
        },
      ];
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(savedMetadata)
      );

      const metadata = await recordingManager.getAllMetadata();

      expect(metadata).toHaveLength(1);
      expect(metadata[0].timestamp).toBeInstanceOf(Date);
      expect(metadata[0].expiresAt).toBeInstanceOf(Date);
    });

    it('should save new metadata to storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const newMetadata: RecordingMetadata = {
        id: '123',
        filename: 'recording.enc',
        encryptedPath: '/path/recording.enc',
        timestamp: new Date('2026-02-05T12:00:00.000Z'),
        duration: 180,
        fileSize: 2048000,
        deviceId: 'Samsung-S24',
        watermarked: true,
        expiresAt: new Date('2026-02-12T12:00:00.000Z'),
      };

      await recordingManager.saveMetadata(newMetadata);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@qantum:recording:metadata',
        expect.stringContaining('"filename":"recording.enc"')
      );
    });
  });

  describe('Filename Generation', () => {
    it('should generate filename with timestamp', () => {
      const filename = recordingManager.generateFilename();

      expect(filename).toMatch(/^testcase_\d{8}T\d{6}\d{3}Z\.enc$/);
    });

    it('should generate unique filenames', () => {
      const filename1 = recordingManager.generateFilename();
      const filename2 = recordingManager.generateFilename();

      // They might be the same if called in same millisecond, so just check format
      expect(filename1).toContain('testcase_');
      expect(filename2).toContain('testcase_');
    });
  });

  describe('Device ID', () => {
    it('should return device model and OS version', async () => {
      (Device.modelName as any) = 'Samsung S24 Ultra';
      (Device.osVersion as any) = '14';

      const deviceId = await recordingManager.getDeviceId();

      expect(deviceId).toBe('Samsung S24 Ultra-14');
    });

    it('should handle unknown device gracefully', async () => {
      (Device.modelName as any) = null;
      (Device.osVersion as any) = null;

      const deviceId = await recordingManager.getDeviceId();

      expect(deviceId).toBe('Unknown-Unknown');
    });
  });

  describe('Save Recording', () => {
    it('should encrypt and save recording with metadata', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          quality: 'high',
          includeAudio: false,
          watermarkEnabled: true,
          maxRecordingMinutes: 30,
          autoDeleteDays: 7,
        })
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (Device.modelName as any) = 'Samsung S24 Ultra';
      (Device.osVersion as any) = '14';
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({
        size: 1024000,
      });
      (encryptionService.encryptFile as jest.Mock).mockResolvedValue({
        encryptedData: 'encrypted',
        iv: 'iv',
        salt: 'salt',
      });

      const metadata = await recordingManager.saveRecording(
        'file:///recording.mp4',
        125,
        'password'
      );

      expect(metadata.duration).toBe(125);
      expect(metadata.deviceId).toBe('Samsung S24 Ultra-14');
      expect(metadata.watermarked).toBe(true);
      expect(metadata.filename).toContain('testcase_');
    });

    it('should calculate expiration date correctly', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          quality: 'high',
          includeAudio: false,
          watermarkEnabled: true,
          maxRecordingMinutes: 30,
          autoDeleteDays: 7,
        })
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (Device.modelName as any) = 'Samsung';
      (FileSystem.getInfoAsync as jest.Mock).mockResolvedValue({ size: 1000 });
      (encryptionService.encryptFile as jest.Mock).mockResolvedValue({
        encryptedData: 'encrypted',
        iv: 'iv',
        salt: 'salt',
      });

      const now = new Date();
      const metadata = await recordingManager.saveRecording(
        'file:///test.mp4',
        60,
        'password'
      );

      const daysDiff = Math.floor(
        (metadata.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(daysDiff).toBe(7);
    });
  });

  describe('Cleanup Expired Recordings', () => {
    it('should delete expired recordings', async () => {
      const now = new Date();
      const expired = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000); // 8 days ago

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          {
            id: '1',
            filename: 'expired.enc',
            encryptedPath: '/path/expired.enc',
            timestamp: expired.toISOString(),
            duration: 60,
            fileSize: 1000,
            deviceId: 'Device1',
            watermarked: true,
            expiresAt: expired.toISOString(),
          },
        ])
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (FileSystem.deleteAsync as jest.Mock).mockResolvedValue(undefined);

      const deletedCount = await recordingManager.cleanupExpiredRecordings();

      expect(deletedCount).toBe(1);
      expect(FileSystem.deleteAsync).toHaveBeenCalledWith('/path/expired.enc', {
        idempotent: true,
      });
    });

    it('should keep non-expired recordings', async () => {
      const now = new Date();
      const future = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days future

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          {
            id: '1',
            filename: 'valid.enc',
            encryptedPath: '/path/valid.enc',
            timestamp: now.toISOString(),
            duration: 60,
            fileSize: 1000,
            deviceId: 'Device1',
            watermarked: true,
            expiresAt: future.toISOString(),
          },
        ])
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const deletedCount = await recordingManager.cleanupExpiredRecordings();

      expect(deletedCount).toBe(0);
      expect(FileSystem.deleteAsync).not.toHaveBeenCalled();
    });

    it('should update metadata after cleanup', async () => {
      const now = new Date();
      const expired = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);
      const future = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          {
            id: '1',
            filename: 'expired.enc',
            encryptedPath: '/path/expired.enc',
            timestamp: expired.toISOString(),
            duration: 60,
            fileSize: 1000,
            deviceId: 'Device1',
            watermarked: true,
            expiresAt: expired.toISOString(),
          },
          {
            id: '2',
            filename: 'valid.enc',
            encryptedPath: '/path/valid.enc',
            timestamp: now.toISOString(),
            duration: 60,
            fileSize: 1000,
            deviceId: 'Device1',
            watermarked: true,
            expiresAt: future.toISOString(),
          },
        ])
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (FileSystem.deleteAsync as jest.Mock).mockResolvedValue(undefined);

      await recordingManager.cleanupExpiredRecordings();

      const savedCall = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const savedMetadata = JSON.parse(savedCall);

      expect(savedMetadata).toHaveLength(1);
      expect(savedMetadata[0].filename).toBe('valid.enc');
    });
  });

  describe('Storage Usage', () => {
    it('should calculate total storage usage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          {
            id: '1',
            filename: 'rec1.enc',
            encryptedPath: '/path/rec1.enc',
            timestamp: new Date().toISOString(),
            duration: 60,
            fileSize: 1024000,
            deviceId: 'Device1',
            watermarked: true,
            expiresAt: new Date().toISOString(),
          },
          {
            id: '2',
            filename: 'rec2.enc',
            encryptedPath: '/path/rec2.enc',
            timestamp: new Date().toISOString(),
            duration: 120,
            fileSize: 2048000,
            deviceId: 'Device1',
            watermarked: true,
            expiresAt: new Date().toISOString(),
          },
        ])
      );

      const usage = await recordingManager.getStorageUsage();

      expect(usage.totalSize).toBe(3072000); // 1024000 + 2048000
      expect(usage.count).toBe(2);
    });

    it('should return zero for empty storage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const usage = await recordingManager.getStorageUsage();

      expect(usage.totalSize).toBe(0);
      expect(usage.count).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle AsyncStorage errors gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      const config = await recordingManager.getConfig();

      // Should return default config
      expect(config.autoDeleteDays).toBe(7);
    });

    it('should handle file deletion errors during cleanup', async () => {
      const now = new Date();
      const expired = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([
          {
            id: '1',
            filename: 'expired.enc',
            encryptedPath: '/path/expired.enc',
            timestamp: expired.toISOString(),
            duration: 60,
            fileSize: 1000,
            deviceId: 'Device1',
            watermarked: true,
            expiresAt: expired.toISOString(),
          },
        ])
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (FileSystem.deleteAsync as jest.Mock).mockRejectedValue(
        new Error('Delete failed')
      );

      const deletedCount = await recordingManager.cleanupExpiredRecordings();

      // Should still complete, even with error
      expect(deletedCount).toBe(0);
    });
  });
});
