"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validators_1 = require("./validators");
const task_1 = require("../models/task");
describe('Validators', () => {
    describe('validateDescription', () => {
        test('should accept valid description', () => {
            const result = (0, validators_1.validateDescription)('Buy groceries');
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
        });
        test('should accept description at max length (500 chars)', () => {
            const longDesc = 'a'.repeat(500);
            const result = (0, validators_1.validateDescription)(longDesc);
            expect(result.valid).toBe(true);
        });
        test('should reject empty description', () => {
            const result = (0, validators_1.validateDescription)('');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('Error: Task description cannot be empty.');
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_EMPTY_DESC);
        });
        test('should reject whitespace-only description', () => {
            const result = (0, validators_1.validateDescription)('   ');
            expect(result.valid).toBe(false);
            expect(result.error).toBe('Error: Task description cannot be only whitespace.');
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_WHITESPACE_DESC);
        });
        test('should reject description over 500 characters', () => {
            const longDesc = 'a'.repeat(501);
            const result = (0, validators_1.validateDescription)(longDesc);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('must be 500 characters or less');
            expect(result.error).toContain('Current: 501');
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_DESC_TOO_LONG);
        });
        test('should trim description before validation', () => {
            const result = (0, validators_1.validateDescription)('  Valid task  ');
            expect(result.valid).toBe(true);
        });
    });
    describe('validateTaskId', () => {
        test('should accept positive integer', () => {
            const result = (0, validators_1.validateTaskId)(1);
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
        });
        test('should accept large positive integer', () => {
            const result = (0, validators_1.validateTaskId)(999999);
            expect(result.valid).toBe(true);
        });
        test('should reject zero', () => {
            const result = (0, validators_1.validateTaskId)(0);
            expect(result.valid).toBe(false);
            expect(result.error).toBe('Error: Task ID must be a positive integer.');
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_INVALID_ID);
        });
        test('should reject negative integer', () => {
            const result = (0, validators_1.validateTaskId)(-1);
            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_INVALID_ID);
        });
        test('should reject decimal number', () => {
            const result = (0, validators_1.validateTaskId)(1.5);
            expect(result.valid).toBe(false);
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_INVALID_ID);
        });
    });
    describe('parseTaskId', () => {
        test('should parse valid integer string', () => {
            const result = (0, validators_1.parseTaskId)('42');
            expect(result).toBe(42);
        });
        test('should parse string with leading zeros', () => {
            const result = (0, validators_1.parseTaskId)('007');
            expect(result).toBe(7);
        });
        test('should return null for non-numeric string', () => {
            const result = (0, validators_1.parseTaskId)('abc');
            expect(result).toBeNull();
        });
        test('should return null for empty string', () => {
            const result = (0, validators_1.parseTaskId)('');
            expect(result).toBeNull();
        });
        test('should parse negative number string', () => {
            const result = (0, validators_1.parseTaskId)('-5');
            expect(result).toBe(-5);
        });
    });
});
//# sourceMappingURL=validators.test.js.map