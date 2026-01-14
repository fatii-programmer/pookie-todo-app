"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_CONSTANTS = exports.ErrorCode = void 0;
/**
 * Error codes for different failure scenarios
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["ERR_EMPTY_DESC"] = "ERR_EMPTY_DESC";
    ErrorCode["ERR_DESC_TOO_LONG"] = "ERR_DESC_TOO_LONG";
    ErrorCode["ERR_WHITESPACE_DESC"] = "ERR_WHITESPACE_DESC";
    ErrorCode["ERR_INVALID_ID"] = "ERR_INVALID_ID";
    ErrorCode["ERR_TASK_NOT_FOUND"] = "ERR_TASK_NOT_FOUND";
    ErrorCode["ERR_UNKNOWN_CMD"] = "ERR_UNKNOWN_CMD";
    ErrorCode["ERR_MISSING_ARG"] = "ERR_MISSING_ARG";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
/**
 * Constants for validation
 */
exports.VALIDATION_CONSTANTS = {
    MIN_DESCRIPTION_LENGTH: 1,
    MAX_DESCRIPTION_LENGTH: 500
};
//# sourceMappingURL=task.js.map