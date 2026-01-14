import { validateDescription, validateTaskId, parseTaskId } from './validators';
import { ErrorCode } from '../models/task';

describe('Validators', () => {
  describe('validateDescription', () => {
    test('should accept valid description', () => {
      const result = validateDescription('Buy groceries');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should accept description at max length (500 chars)', () => {
      const longDesc = 'a'.repeat(500);
      const result = validateDescription(longDesc);
      expect(result.valid).toBe(true);
    });

    test('should reject empty description', () => {
      const result = validateDescription('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Error: Task description cannot be empty.');
      expect(result.errorCode).toBe(ErrorCode.ERR_EMPTY_DESC);
    });

    test('should reject whitespace-only description', () => {
      const result = validateDescription('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Error: Task description cannot be only whitespace.');
      expect(result.errorCode).toBe(ErrorCode.ERR_WHITESPACE_DESC);
    });

    test('should reject description over 500 characters', () => {
      const longDesc = 'a'.repeat(501);
      const result = validateDescription(longDesc);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('must be 500 characters or less');
      expect(result.error).toContain('Current: 501');
      expect(result.errorCode).toBe(ErrorCode.ERR_DESC_TOO_LONG);
    });

    test('should trim description before validation', () => {
      const result = validateDescription('  Valid task  ');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateTaskId', () => {
    test('should accept positive integer', () => {
      const result = validateTaskId(1);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should accept large positive integer', () => {
      const result = validateTaskId(999999);
      expect(result.valid).toBe(true);
    });

    test('should reject zero', () => {
      const result = validateTaskId(0);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Error: Task ID must be a positive integer.');
      expect(result.errorCode).toBe(ErrorCode.ERR_INVALID_ID);
    });

    test('should reject negative integer', () => {
      const result = validateTaskId(-1);
      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(ErrorCode.ERR_INVALID_ID);
    });

    test('should reject decimal number', () => {
      const result = validateTaskId(1.5);
      expect(result.valid).toBe(false);
      expect(result.errorCode).toBe(ErrorCode.ERR_INVALID_ID);
    });
  });

  describe('parseTaskId', () => {
    test('should parse valid integer string', () => {
      const result = parseTaskId('42');
      expect(result).toBe(42);
    });

    test('should parse string with leading zeros', () => {
      const result = parseTaskId('007');
      expect(result).toBe(7);
    });

    test('should return null for non-numeric string', () => {
      const result = parseTaskId('abc');
      expect(result).toBeNull();
    });

    test('should return null for empty string', () => {
      const result = parseTaskId('');
      expect(result).toBeNull();
    });

    test('should parse negative number string', () => {
      const result = parseTaskId('-5');
      expect(result).toBe(-5);
    });
  });
});
