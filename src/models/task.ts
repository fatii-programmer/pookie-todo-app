/**
 * Represents a task in the todo list
 */
export interface Task {
  /** Unique identifier, positive integer, auto-generated */
  id: number;

  /** Task description, 1-500 characters */
  description: string;

  /** Completion status, default false */
  completed: boolean;

  /** Timestamp when task was created */
  createdAt: Date;
}

/**
 * Result type for operations that may fail
 */
export interface OperationResult {
  /** Whether the operation succeeded */
  success: boolean;

  /** Error message if operation failed */
  error?: string;

  /** Error code for categorizing errors */
  errorCode?: ErrorCode;

  /** Optional data payload for successful operations */
  data?: Task | Task[];
}

/**
 * Error codes for different failure scenarios
 */
export enum ErrorCode {
  ERR_EMPTY_DESC = 'ERR_EMPTY_DESC',
  ERR_DESC_TOO_LONG = 'ERR_DESC_TOO_LONG',
  ERR_WHITESPACE_DESC = 'ERR_WHITESPACE_DESC',
  ERR_INVALID_ID = 'ERR_INVALID_ID',
  ERR_TASK_NOT_FOUND = 'ERR_TASK_NOT_FOUND',
  ERR_UNKNOWN_CMD = 'ERR_UNKNOWN_CMD',
  ERR_MISSING_ARG = 'ERR_MISSING_ARG'
}

/**
 * Constants for validation
 */
export const VALIDATION_CONSTANTS = {
  MIN_DESCRIPTION_LENGTH: 1,
  MAX_DESCRIPTION_LENGTH: 500
} as const;
