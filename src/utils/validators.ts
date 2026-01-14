import { ErrorCode, VALIDATION_CONSTANTS } from '../models/task.js';

/**
 * Result of a validation check
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;

  /** Error message if validation failed */
  error?: string;

  /** Error code if validation failed */
  errorCode?: ErrorCode;
}

/**
 * Validates a task description according to spec requirements
 * - Must not be empty after trimming
 * - Must not be whitespace only
 * - Must be between 1-500 characters
 *
 * @param description - The description to validate
 * @returns ValidationResult indicating if description is valid
 */
export function validateDescription(description: string): ValidationResult {
  const trimmed = description.trim();

  if (description.length === 0 || trimmed.length === 0) {
    if (description.length > 0 && trimmed.length === 0) {
      return {
        valid: false,
        error: 'Error: Task description cannot be only whitespace.',
        errorCode: ErrorCode.ERR_WHITESPACE_DESC
      };
    }
    return {
      valid: false,
      error: 'Error: Task description cannot be empty.',
      errorCode: ErrorCode.ERR_EMPTY_DESC
    };
  }

  if (trimmed.length > VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      error: `Error: Task description must be ${VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH} characters or less. (Current: ${trimmed.length})`,
      errorCode: ErrorCode.ERR_DESC_TOO_LONG
    };
  }

  return { valid: true };
}

/**
 * Validates a task ID
 * - Must be a positive integer
 *
 * @param id - The ID to validate
 * @returns ValidationResult indicating if ID is valid
 */
export function validateTaskId(id: number): ValidationResult {
  if (!Number.isInteger(id) || id <= 0) {
    return {
      valid: false,
      error: 'Error: Task ID must be a positive integer.',
      errorCode: ErrorCode.ERR_INVALID_ID
    };
  }

  return { valid: true };
}

/**
 * Parses a string to a task ID (positive integer)
 *
 * @param idString - The string to parse
 * @returns The parsed ID or null if invalid
 */
export function parseTaskId(idString: string): number | null {
  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    return null;
  }
  return id;
}
