"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const readline = __importStar(require("readline"));
const validators_js_1 = require("../utils/validators.js");
/**
 * CLI interface for the Todo application
 * Handles all user interaction and command processing
 */
class CLI {
    taskService;
    rl;
    running = false;
    constructor(taskService) {
        this.taskService = taskService;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    /**
     * Starts the CLI application
     */
    start() {
        this.running = true;
        this.displayWelcome();
        this.promptCommand();
    }
    /**
     * Displays the welcome message
     */
    displayWelcome() {
        console.log('╔════════════════════════════════════════╗');
        console.log('║     Evolution of Todo - Phase I        ║');
        console.log('║         Task Management System         ║');
        console.log('╚════════════════════════════════════════╝');
        console.log('');
        console.log("Type 'help' for available commands or 'exit' to quit.");
        console.log('');
    }
    /**
     * Prompts user for next command
     */
    promptCommand() {
        if (!this.running) {
            return;
        }
        this.rl.question('> ', (input) => {
            this.processCommand(input.trim());
        });
    }
    /**
     * Processes a user command
     */
    processCommand(input) {
        const parts = input.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        const handler = this.getCommandHandler(command);
        if (handler) {
            handler(args);
        }
        else {
            this.handleUnknownCommand(command);
        }
    }
    /**
     * Gets the appropriate command handler
     */
    getCommandHandler(command) {
        const handlers = {
            'add': (args) => this.handleAdd(args.join(' ')),
            'a': (args) => this.handleAdd(args.join(' ')),
            'new': (args) => this.handleAdd(args.join(' ')),
            'delete': (args) => this.handleDelete(args[0]),
            'del': (args) => this.handleDelete(args[0]),
            'remove': (args) => this.handleDelete(args[0]),
            'rm': (args) => this.handleDelete(args[0]),
            'update': (args) => this.handleUpdate(args[0]),
            'edit': (args) => this.handleUpdate(args[0]),
            'modify': (args) => this.handleUpdate(args[0]),
            'list': () => this.handleList(),
            'ls': () => this.handleList(),
            'view': () => this.handleList(),
            'all': () => this.handleList(),
            'complete': (args) => this.handleComplete(args[0]),
            'done': (args) => this.handleComplete(args[0]),
            'finish': (args) => this.handleComplete(args[0]),
            'incomplete': (args) => this.handleIncomplete(args[0]),
            'undone': (args) => this.handleIncomplete(args[0]),
            'todo': (args) => this.handleIncomplete(args[0]),
            'toggle': (args) => this.handleToggle(args[0]),
            't': (args) => this.handleToggle(args[0]),
            'help': () => this.handleHelp(),
            'h': () => this.handleHelp(),
            '?': () => this.handleHelp(),
            'exit': () => this.handleExit(),
            'quit': () => this.handleExit(),
            'q': () => this.handleExit(),
            '': () => this.promptCommand()
        };
        return handlers[command] ?? null;
    }
    /**
     * Handles unknown commands
     */
    handleUnknownCommand(command) {
        console.log(`✗ Error: Unknown command '${command}'. Type 'help' for available commands.`);
        console.log('');
        this.promptCommand();
    }
    /**
     * Handles the 'add' command
     */
    handleAdd(inlineDescription) {
        if (inlineDescription) {
            const result = this.taskService.addTask(inlineDescription);
            if (result.success && result.data) {
                const task = result.data;
                console.log(`✓ Task #${task.id} added successfully.`);
            }
            else {
                console.log(`✗ ${result.error ?? 'Unknown error'}`);
            }
            console.log('');
            this.promptCommand();
        }
        else {
            this.rl.question('Enter task description: ', (description) => {
                const result = this.taskService.addTask(description);
                if (result.success && result.data) {
                    const task = result.data;
                    console.log(`✓ Task #${task.id} added successfully.`);
                }
                else {
                    console.log(`✗ ${result.error ?? 'Unknown error'}`);
                }
                console.log('');
                this.promptCommand();
            });
        }
    }
    /**
     * Handles the 'delete' command
     */
    handleDelete(idString) {
        if (!idString) {
            console.log('✗ Error: Please provide a valid task ID. Usage: delete <id>');
            console.log('');
            this.promptCommand();
            return;
        }
        const id = (0, validators_js_1.parseTaskId)(idString);
        if (id === null) {
            console.log('✗ Error: Task ID must be a positive integer.');
            console.log('');
            this.promptCommand();
            return;
        }
        const result = this.taskService.deleteTask(id);
        if (result.success) {
            console.log(`✓ Task #${id} deleted successfully.`);
        }
        else {
            console.log(`✗ ${result.error ?? 'Unknown error'}`);
        }
        console.log('');
        this.promptCommand();
    }
    /**
     * Handles the 'update' command
     */
    handleUpdate(idString) {
        if (!idString) {
            console.log('✗ Error: Please provide a valid task ID. Usage: update <id>');
            console.log('');
            this.promptCommand();
            return;
        }
        const id = (0, validators_js_1.parseTaskId)(idString);
        if (id === null) {
            console.log('✗ Error: Task ID must be a positive integer.');
            console.log('');
            this.promptCommand();
            return;
        }
        const task = this.taskService.getTaskById(id);
        if (!task) {
            console.log(`✗ Error: Task #${id} not found.`);
            console.log('');
            this.promptCommand();
            return;
        }
        console.log(`Current: ${task.description}`);
        this.rl.question('Enter new description: ', (newDescription) => {
            const result = this.taskService.updateTask(id, newDescription);
            if (result.success) {
                console.log(`✓ Task #${id} updated successfully.`);
            }
            else {
                console.log(`✗ ${result.error ?? 'Unknown error'}`);
            }
            console.log('');
            this.promptCommand();
        });
    }
    /**
     * Handles the 'list' command
     */
    handleList() {
        const result = this.taskService.getAllTasks();
        if (result.success && result.data) {
            const tasks = result.data;
            if (tasks.length === 0) {
                console.log("No tasks found. Use 'add' to create a task.");
            }
            else {
                console.log('Your Tasks:');
                console.log('-----------');
                tasks.forEach(task => {
                    const status = task.completed ? 'x' : ' ';
                    console.log(`${task.id}. [${status}] ${task.description}`);
                });
            }
        }
        console.log('');
        this.promptCommand();
    }
    /**
     * Handles the 'complete' command
     */
    handleComplete(idString) {
        if (!idString) {
            console.log('✗ Error: Please provide a valid task ID. Usage: complete <id>');
            console.log('');
            this.promptCommand();
            return;
        }
        const id = (0, validators_js_1.parseTaskId)(idString);
        if (id === null) {
            console.log('✗ Error: Task ID must be a positive integer.');
            console.log('');
            this.promptCommand();
            return;
        }
        const result = this.taskService.completeTask(id);
        if (result.success) {
            console.log(`✓ Task #${id} marked as complete.`);
        }
        else {
            console.log(`✗ ${result.error ?? 'Unknown error'}`);
        }
        console.log('');
        this.promptCommand();
    }
    /**
     * Handles the 'incomplete' command
     */
    handleIncomplete(idString) {
        if (!idString) {
            console.log('✗ Error: Please provide a valid task ID. Usage: incomplete <id>');
            console.log('');
            this.promptCommand();
            return;
        }
        const id = (0, validators_js_1.parseTaskId)(idString);
        if (id === null) {
            console.log('✗ Error: Task ID must be a positive integer.');
            console.log('');
            this.promptCommand();
            return;
        }
        const result = this.taskService.incompleteTask(id);
        if (result.success) {
            console.log(`✓ Task #${id} marked as incomplete.`);
        }
        else {
            console.log(`✗ ${result.error ?? 'Unknown error'}`);
        }
        console.log('');
        this.promptCommand();
    }
    /**
     * Handles the 'toggle' command
     */
    handleToggle(idString) {
        if (!idString) {
            console.log('✗ Error: Please provide a valid task ID. Usage: toggle <id>');
            console.log('');
            this.promptCommand();
            return;
        }
        const id = (0, validators_js_1.parseTaskId)(idString);
        if (id === null) {
            console.log('✗ Error: Task ID must be a positive integer.');
            console.log('');
            this.promptCommand();
            return;
        }
        const result = this.taskService.toggleTask(id);
        if (result.success && result.data) {
            const task = result.data;
            const status = task.completed ? 'complete' : 'incomplete';
            console.log(`✓ Task #${id} marked as ${status}.`);
        }
        else {
            console.log(`✗ ${result.error ?? 'Unknown error'}`);
        }
        console.log('');
        this.promptCommand();
    }
    /**
     * Handles the 'help' command
     */
    handleHelp() {
        console.log('Available Commands:');
        console.log('------------------');
        console.log('  add [description]       Add a new task');
        console.log('  delete <id>             Delete a task by ID');
        console.log('  update <id>             Update task description');
        console.log('  list                    View all tasks');
        console.log('  complete <id>           Mark task as complete');
        console.log('  incomplete <id>         Mark task as incomplete');
        console.log('  toggle <id>             Toggle task completion status');
        console.log('  help                    Show this help message');
        console.log('  exit                    Exit the application');
        console.log('');
        console.log('Examples:');
        console.log('---------');
        console.log('  > add Buy groceries');
        console.log('  > list');
        console.log('  > complete 1');
        console.log('  > update 2');
        console.log('  > delete 3');
        console.log('');
        this.promptCommand();
    }
    /**
     * Handles the 'exit' command
     */
    handleExit() {
        console.log('Goodbye! Your tasks will not be saved.');
        this.running = false;
        this.rl.close();
        process.exit(0);
    }
}
exports.CLI = CLI;
//# sourceMappingURL=cli.js.map