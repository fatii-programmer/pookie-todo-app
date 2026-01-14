import { TaskService } from '../services/taskService.js';
/**
 * CLI interface for the Todo application
 * Handles all user interaction and command processing
 */
export declare class CLI {
    private taskService;
    private rl;
    private running;
    constructor(taskService: TaskService);
    /**
     * Starts the CLI application
     */
    start(): void;
    /**
     * Displays the welcome message
     */
    private displayWelcome;
    /**
     * Prompts user for next command
     */
    private promptCommand;
    /**
     * Processes a user command
     */
    private processCommand;
    /**
     * Gets the appropriate command handler
     */
    private getCommandHandler;
    /**
     * Handles unknown commands
     */
    private handleUnknownCommand;
    /**
     * Handles the 'add' command
     */
    private handleAdd;
    /**
     * Handles the 'delete' command
     */
    private handleDelete;
    /**
     * Handles the 'update' command
     */
    private handleUpdate;
    /**
     * Handles the 'list' command
     */
    private handleList;
    /**
     * Handles the 'complete' command
     */
    private handleComplete;
    /**
     * Handles the 'incomplete' command
     */
    private handleIncomplete;
    /**
     * Handles the 'toggle' command
     */
    private handleToggle;
    /**
     * Handles the 'help' command
     */
    private handleHelp;
    /**
     * Handles the 'exit' command
     */
    private handleExit;
}
//# sourceMappingURL=cli.d.ts.map