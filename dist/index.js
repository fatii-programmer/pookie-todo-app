#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskService_js_1 = require("./services/taskService.js");
const cli_js_1 = require("./ui/cli.js");
/**
 * Main entry point for the Evolution of Todo application
 * Initializes the task service and CLI, then starts the application
 */
function main() {
    try {
        const taskService = new taskService_js_1.TaskService();
        const cli = new cli_js_1.CLI(taskService);
        cli.start();
    }
    catch (error) {
        console.error('✗ Error: An unexpected error occurred. Please try again.');
        console.error(error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map