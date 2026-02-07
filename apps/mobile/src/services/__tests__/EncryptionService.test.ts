/**
 * 🧪 EncryptionService Unit Tests
 * Comprehensive test suite for AES-256 encryption service
 */

import { encryptionService } from '../EncryptionService';
import Aes from 'react-native-aes-crypto';
import * as Crypto from 'expo-crypto';

// Mock implementations
jest.mock('react-native-aes-crypto');
jest.mock('expo-crypto');

describe('EncryptionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = encryptionService;
      const instance2 = encryptionService;
      expect(instance1).toBe(instance2);
    });
  });

  describe('Key Generation', () => {
    it('should generate a secure key using PBKDF2', async () => {
      const mockKey = 'mock-generated-key-256-bits';
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue(mockKey);

      const password = 'test-password';
      const salt = '0123456789abcdef';
      
      // Access private method through encryption
      const result = await encryptionService.encrypt('test data', password);
      
      expect(Aes.pbkdf2).toHaveBeenCalledWith(
        password,
        expect.any(String),
        10000,
        256
      );
    });

    it('should use 10,000 iterations for key derivation', async () => {
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('mock-key');
      (Aes.encrypt as jest.Mock).mockResolvedValue('encrypted-data');
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(
        new Uint8Array(16).fill(1)
      );

      await encryptionService.encrypt('test', 'password');

      expect(Aes.pbkdf2).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        10000,
        256
      );
    });
  });

  describe('Salt Generation', () => {
    it('should generate random 16-byte salt', async () => {
      const mockBytes = new Uint8Array(16).fill(255);
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(mockBytes);
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('mock-key');
      (Aes.encrypt as jest.Mock).mockResolvedValue('encrypted');

      await encryptionService.encrypt('data', 'password');

      expect(Crypto.getRandomBytesAsync).toHaveBeenCalledWith(16);
    });

    it('should generate unique salts for each encryption', async () => {
      let callCount = 0;
      (Crypto.getRandomBytesAsync as jest.Mock).mockImplementation(() => {
        callCount++;
        return Promise.resolve(new Uint8Array(16).fill(callCount));
      });
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('mock-key');
      (Aes.encrypt as jest.Mock).mockResolvedValue('encrypted');

      const result1 = await encryptionService.encrypt('data1', 'password');
      const result2 = await encryptionService.encrypt('data2', 'password');

      expect(result1.salt).not.toBe(result2.salt);
    });
  });

  describe('IV Generation', () => {
    it('should generate random 16-byte IV', async () => {
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(
        new Uint8Array(16).fill(1)
      );
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('mock-key');
      (Aes.encrypt as jest.Mock).mockResolvedValue('encrypted');

      await encryptionService.encrypt('data', 'password');

      // Called twice: once for salt, once for IV
      expect(Crypto.getRandomBytesAsync).toHaveBeenCalledTimes(2);
    });

    it('should generate unique IVs for each encryption', async () => {
      let callCount = 0;
      (Crypto.getRandomBytesAsync as jest.Mock).mockImplementation(() => {
        callCount++;
        return Promise.resolve(new Uint8Array(16).fill(callCount));
      });
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('mock-key');
      (Aes.encrypt as jest.Mock).mockResolvedValue('encrypted');

      const result1 = await encryptionService.encrypt('data1', 'password');
      const result2 = await encryptionService.encrypt('data2', 'password');

      expect(result1.iv).not.toBe(result2.iv);
    });
  });

  describe('Encryption', () => {
    it('should encrypt data using AES-256-CBC', async () => {
      const testData = 'sensitive data to encrypt';
      const password = 'strong-password';
      const mockEncrypted = 'encrypted-base64-data';

      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(
        new Uint8Array(16).fill(1)
      );
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('mock-key-256-bit');
      (Aes.encrypt as jest.Mock).mockResolvedValue(mockEncrypted);

      const result = await encryptionService.encrypt(testData, password);

      expect(Aes.encrypt).toHaveBeenCalledWith(
        testData,
        'mock-key-256-bit',
        expect.any(String),
        'aes-256-cbc'
      );
      expect(result.encryptedData).toBe(mockEncrypted);
    });

    it('should return encryption result with IV and salt', async () => {
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(
        new Uint8Array(16).fill(1)
      );
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('key');
      (Aes.encrypt as jest.Mock).mockResolvedValue('encrypted');

      const result = await encryptionService.encrypt('data', 'password');

      expect(result).toHaveProperty('encryptedData');
      expect(result).toHaveProperty('iv');
      expect(result).toHaveProperty('salt');
      expect(typeof result.encryptedData).toBe('string');
      expect(typeof result.iv).toBe('string');
      expect(typeof result.salt).toBe('string');
    });

    it('should handle encryption errors gracefully', async () => {
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(
        new Uint8Array(16).fill(1)
      );
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('key');
      (Aes.encrypt as jest.Mock).mockRejectedValue(new Error('Encryption failed'));

      await expect(
        encryptionService.encrypt('data', 'password')
      ).rejects.toThrow('Failed to encrypt data');
    });
  });

  describe('Decryption', () => {
    it('should decrypt data using AES-256-CBC', async () => {
      const mockDecrypted = 'original plain text';
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('mock-key');
      (Aes.decrypt as jest.Mock).mockResolvedValue(mockDecrypted);

      const params = {
        encryptedData: 'encrypted-data',
        iv: '0123456789abcdef',
        salt: 'fedcba9876543210',
        key: 'password',
      };

      const result = await encryptionService.decrypt(params);

      expect(Aes.decrypt).toHaveBeenCalledWith(
        'encrypted-data',
        'mock-key',
        '0123456789abcdef',
        'aes-256-cbc'
      );
      expect(result).toBe(mockDecrypted);
    });

    it('should regenerate same key from password and salt', async () => {
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('regenerated-key');
      (Aes.decrypt as jest.Mock).mockResolvedValue('decrypted');

      const params = {
        encryptedData: 'encrypted',
        iv: 'iv-value',
        salt: 'salt-value',
        key: 'password',
      };

      await encryptionService.decrypt(params);

      expect(Aes.pbkdf2).toHaveBeenCalledWith(
        'password',
        'salt-value',
        10000,
        256
      );
    });

    it('should handle decryption errors gracefully', async () => {
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('key');
      (Aes.decrypt as jest.Mock).mockRejectedValue(new Error('Decryption failed'));

      const params = {
        encryptedData: 'invalid',
        iv: 'iv',
        salt: 'salt',
        key: 'password',
      };

      await expect(
        encryptionService.decrypt(params)
      ).rejects.toThrow('Failed to decrypt data');
    });
  });

  describe('Encryption/Decryption Cycle', () => {
    it('should successfully encrypt and decrypt data', async () => {
      const originalData = 'test data for encryption cycle';
      const password = 'secure-password-123';

      // Mock encryption
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(
        new Uint8Array(16).fill(1)
      );
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('mock-key');
      (Aes.encrypt as jest.Mock).mockResolvedValue('encrypted-data');

      const encrypted = await encryptionService.encrypt(originalData, password);

      // Mock decryption
      (Aes.decrypt as jest.Mock).mockResolvedValue(originalData);

      const decrypted = await encryptionService.decrypt({
        encryptedData: encrypted.encryptedData,
        iv: encrypted.iv,
        salt: encrypted.salt,
        key: password,
      });

      expect(decrypted).toBe(originalData);
    });
  });

  describe('File Encryption', () => {
    it('should handle file encryption with TODO warning', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(
        new Uint8Array(16).fill(1)
      );
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('key');
      (Aes.encrypt as jest.Mock).mockResolvedValue('encrypted');

      const result = await encryptionService.encryptFile(
        'file:///path/to/recording.mp4',
        'password'
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('placeholder')
      );
      expect(result).toHaveProperty('encryptedData');
    });

    it('should encrypt file URI as placeholder', async () => {
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(
        new Uint8Array(16).fill(1)
      );
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('key');
      (Aes.encrypt as jest.Mock).mockResolvedValue('encrypted');

      const fileUri = 'file:///documents/test.mp4';
      const result = await encryptionService.encryptFile(fileUri, 'password');

      expect(Aes.encrypt).toHaveBeenCalledWith(
        fileUri,
        expect.any(String),
        expect.any(String),
        'aes-256-cbc'
      );
    });
  });

  describe('Performance', () => {
    it('should complete encryption in reasonable time', async () => {
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(
        new Uint8Array(16).fill(1)
      );
      (Aes.pbkdf2 as jest.Mock).mockResolvedValue('key');
      (Aes.encrypt as jest.Mock).mockResolvedValue('encrypted');

      const start = Date.now();
      await encryptionService.encrypt('test data', 'password');
      const duration = Date.now() - start;

      // Should complete quickly (mocked, so very fast)
      expect(duration).toBeLessThan(100);
    });
  });

  describe('Error Handling', () => {
    it('should throw meaningful error on salt generation failure', async () => {
      (Crypto.getRandomBytesAsync as jest.Mock).mockRejectedValue(
        new Error('Random bytes failed')
      );

      await expect(
        encryptionService.encrypt('data', 'password')
      ).rejects.toThrow();
    });

    it('should throw meaningful error on key derivation failure', async () => {
      (Crypto.getRandomBytesAsync as jest.Mock).mockResolvedValue(
        new Uint8Array(16).fill(1)
      );
      (Aes.pbkdf2 as jest.Mock).mockRejectedValue(
        new Error('PBKDF2 failed')
      );

      await expect(
        encryptionService.encrypt('data', 'password')
      ).rejects.toThrow('Failed to encrypt data');
    });
  });
});
