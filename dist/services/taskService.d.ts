import { Task, OperationResult } from '../models/task.js';
/**
 * Service class for managing tasks in memory
 * Implements all business logic for task operations
 */
export declare class TaskService {
    private tasks;
    private nextId;
    /**
     * Adds a new task to the list
     *
     * @param description - The task description
     * @returns OperationResult with the created task or error
     */
    addTask(description: string): OperationResult;
    /**
     * Deletes a task by ID
     *
     * @param id - The task ID to delete
     * @returns OperationResult indicating success or failure
     */
    deleteTask(id: number): OperationResult;
    /**
     * Updates a task's description
     *
     * @param id - The task ID to update
     * @param newDescription - The new description
     * @returns OperationResult with updated task or error
     */
    updateTask(id: number, newDescription: string): OperationResult;
    /**
     * Retrieves all tasks ordered by creation time
     *
     * @returns OperationResult with array of all tasks
     */
    getAllTasks(): OperationResult;
    /**
     * Toggles a task's completion status
     *
     * @param id - The task ID to toggle
     * @returns OperationResult with updated task or error
     */
    toggleTask(id: number): OperationResult;
    /**
     * Marks a task as complete (sets completed = true)
     *
     * @param id - The task ID to mark complete
     * @returns OperationResult with updated task or error
     */
    completeTask(id: number): OperationResult;
    /**
     * Marks a task as incomplete (sets completed = false)
     *
     * @param id - The task ID to mark incomplete
     * @returns OperationResult with updated task or error
     */
    incompleteTask(id: number): OperationResult;
    /**
     * Gets a task by ID (for testing/internal use)
     *
     * @param id - The task ID to retrieve
     * @returns The task or undefined if not found
     */
    getTaskById(id: number): Task | undefined;
}
//# sourceMappingURL=taskService.d.ts.map