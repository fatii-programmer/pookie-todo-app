"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDescription = validateDescription;
exports.validateTaskId = validateTaskId;
exports.parseTaskId = parseTaskId;
const task_js_1 = require("../models/task.js");
/**
 * Validates a task description according to spec requirements
 * - Must not be empty after trimming
 * - Must not be whitespace only
 * - Must be between 1-500 characters
 *
 * @param description - The description to validate
 * @returns ValidationResult indicating if description is valid
 */
function validateDescription(description) {
    const trimmed = description.trim();
    if (description.length === 0 || trimmed.length === 0) {
        if (description.length > 0 && trimmed.length === 0) {
            return {
                valid: false,
                error: 'Error: Task description cannot be only whitespace.',
                errorCode: task_js_1.ErrorCode.ERR_WHITESPACE_DESC
            };
        }
        return {
            valid: false,
            error: 'Error: Task description cannot be empty.',
            errorCode: task_js_1.ErrorCode.ERR_EMPTY_DESC
        };
    }
    if (trimmed.length > task_js_1.VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH) {
        return {
            valid: false,
            error: `Error: Task description must be ${task_js_1.VALIDATION_CONSTANTS.MAX_DESCRIPTION_LENGTH} characters or less. (Current: ${trimmed.length})`,
            errorCode: task_js_1.ErrorCode.ERR_DESC_TOO_LONG
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
function validateTaskId(id) {
    if (!Number.isInteger(id) || id <= 0) {
        return {
            valid: false,
            error: 'Error: Task ID must be a positive integer.',
            errorCode: task_js_1.ErrorCode.ERR_INVALID_ID
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
function parseTaskId(idString) {
    const id = parseInt(idString, 10);
    if (isNaN(id)) {
        return null;
    }
    return id;
}
//# sourceMappingURL=validators.js.map