import { Task, OperationResult, ErrorCode } from '../models/task.js';
import { validateDescription, validateTaskId } from '../utils/validators.js';

/**
 * Service class for managing tasks in memory
 * Implements all business logic for task operations
 */
export class TaskService {
  private tasks: Task[] = [];
  private nextId: number = 1;

  /**
   * Adds a new task to the list
   *
   * @param description - The task description
   * @returns OperationResult with the created task or error
   */
  addTask(description: string): OperationResult {
    const validation = validateDescription(description);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.errorCode
      };
    }

    const task: Task = {
      id: this.nextId++,
      description: description.trim(),
      completed: false,
      createdAt: new Date()
    };

    this.tasks.push(task);

    return {
      success: true,
      data: task
    };
  }

  /**
   * Deletes a task by ID
   *
   * @param id - The task ID to delete
   * @returns OperationResult indicating success or failure
   */
  deleteTask(id: number): OperationResult {
    const validation = validateTaskId(id);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.errorCode
      };
    }

    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return {
        success: false,
        error: `Error: Task #${id} not found.`,
        errorCode: ErrorCode.ERR_TASK_NOT_FOUND
      };
    }

    this.tasks.splice(index, 1);

    return {
      success: true
    };
  }

  /**
   * Updates a task's description
   *
   * @param id - The task ID to update
   * @param newDescription - The new description
   * @returns OperationResult with updated task or error
   */
  updateTask(id: number, newDescription: string): OperationResult {
    const idValidation = validateTaskId(id);
    if (!idValidation.valid) {
      return {
        success: false,
        error: idValidation.error,
        errorCode: idValidation.errorCode
      };
    }

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      return {
        success: false,
        error: `Error: Task #${id} not found.`,
        errorCode: ErrorCode.ERR_TASK_NOT_FOUND
      };
    }

    const descValidation = validateDescription(newDescription);
    if (!descValidation.valid) {
      return {
        success: false,
        error: descValidation.error,
        errorCode: descValidation.errorCode
      };
    }

    task.description = newDescription.trim();

    return {
      success: true,
      data: task
    };
  }

  /**
   * Retrieves all tasks ordered by creation time
   *
   * @returns OperationResult with array of all tasks
   */
  getAllTasks(): OperationResult {
    return {
      success: true,
      data: [...this.tasks]
    };
  }

  /**
   * Toggles a task's completion status
   *
   * @param id - The task ID to toggle
   * @returns OperationResult with updated task or error
   */
  toggleTask(id: number): OperationResult {
    const validation = validateTaskId(id);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.errorCode
      };
    }

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      return {
        success: false,
        error: `Error: Task #${id} not found.`,
        errorCode: ErrorCode.ERR_TASK_NOT_FOUND
      };
    }

    task.completed = !task.completed;

    return {
      success: true,
      data: task
    };
  }

  /**
   * Marks a task as complete (sets completed = true)
   *
   * @param id - The task ID to mark complete
   * @returns OperationResult with updated task or error
   */
  completeTask(id: number): OperationResult {
    const validation = validateTaskId(id);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.errorCode
      };
    }

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      return {
        success: false,
        error: `Error: Task #${id} not found.`,
        errorCode: ErrorCode.ERR_TASK_NOT_FOUND
      };
    }

    task.completed = true;

    return {
      success: true,
      data: task
    };
  }

  /**
   * Marks a task as incomplete (sets completed = false)
   *
   * @param id - The task ID to mark incomplete
   * @returns OperationResult with updated task or error
   */
  incompleteTask(id: number): OperationResult {
    const validation = validateTaskId(id);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        errorCode: validation.errorCode
      };
    }

    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      return {
        success: false,
        error: `Error: Task #${id} not found.`,
        errorCode: ErrorCode.ERR_TASK_NOT_FOUND
      };
    }

    task.completed = false;

    return {
      success: true,
      data: task
    };
  }

  /**
   * Gets a task by ID (for testing/internal use)
   *
   * @param id - The task ID to retrieve
   * @returns The task or undefined if not found
   */
  getTaskById(id: number): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }
}
