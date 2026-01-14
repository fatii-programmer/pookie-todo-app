import { ErrorCode } from '../models/task.js';
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
export declare function validateDescription(description: string): ValidationResult;
/**
 * Validates a task ID
 * - Must be a positive integer
 *
 * @param id - The ID to validate
 * @returns ValidationResult indicating if ID is valid
 */
export declare function validateTaskId(id: number): ValidationResult;
/**
 * Parses a string to a task ID (positive integer)
 *
 * @param idString - The string to parse
 * @returns The parsed ID or null if invalid
 */
export declare function parseTaskId(idString: string): number | null;
//# sourceMappingURL=validators.d.ts.map