#!/usr/bin/env node

import { TaskService } from './services/taskService.js';
import { CLI } from './ui/cli.js';

/**
 * Main entry point for the Evolution of Todo application
 * Initializes the task service and CLI, then starts the application
 */
function main(): void {
  try {
    const taskService = new TaskService();
    const cli = new CLI(taskService);
    cli.start();
  } catch (error) {
    console.error('✗ Error: An unexpected error occurred. Please try again.');
    console.error(error);
    process.exit(1);
  }
}

main();
