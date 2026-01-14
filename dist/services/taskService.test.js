"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const taskService_1 = require("./taskService");
const task_1 = require("../models/task");
describe('TaskService', () => {
    let service;
    beforeEach(() => {
        service = new taskService_1.TaskService();
    });
    describe('addTask', () => {
        test('should add a task with valid description', () => {
            const result = service.addTask('Buy groceries');
            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            if (result.data && !Array.isArray(result.data)) {
                expect(result.data.id).toBe(1);
                expect(result.data.description).toBe('Buy groceries');
                expect(result.data.completed).toBe(false);
                expect(result.data.createdAt).toBeInstanceOf(Date);
            }
        });
        test('should auto-increment task IDs', () => {
            const result1 = service.addTask('Task 1');
            const result2 = service.addTask('Task 2');
            const result3 = service.addTask('Task 3');
            expect(result1.data && !Array.isArray(result1.data) && result1.data.id).toBe(1);
            expect(result2.data && !Array.isArray(result2.data) && result2.data.id).toBe(2);
            expect(result3.data && !Array.isArray(result3.data) && result3.data.id).toBe(3);
        });
        test('should trim description', () => {
            const result = service.addTask('  Trimmed task  ');
            expect(result.data && !Array.isArray(result.data) && result.data.description).toBe('Trimmed task');
        });
        test('should reject empty description', () => {
            const result = service.addTask('');
            expect(result.success).toBe(false);
            expect(result.error).toContain('cannot be empty');
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_EMPTY_DESC);
        });
        test('should reject whitespace-only description', () => {
            const result = service.addTask('   ');
            expect(result.success).toBe(false);
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_WHITESPACE_DESC);
        });
        test('should reject description over 500 characters', () => {
            const longDesc = 'a'.repeat(501);
            const result = service.addTask(longDesc);
            expect(result.success).toBe(false);
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_DESC_TOO_LONG);
        });
    });
    describe('deleteTask', () => {
        test('should delete existing task', () => {
            service.addTask('Task to delete');
            const result = service.deleteTask(1);
            expect(result.success).toBe(true);
            const tasks = service.getAllTasks();
            expect(tasks.data).toHaveLength(0);
        });
        test('should not reuse deleted IDs', () => {
            service.addTask('Task 1');
            service.addTask('Task 2');
            service.deleteTask(1);
            const result = service.addTask('Task 3');
            expect(result.data && !Array.isArray(result.data) && result.data.id).toBe(3);
        });
        test('should return error for non-existent task', () => {
            const result = service.deleteTask(999);
            expect(result.success).toBe(false);
            expect(result.error).toContain('Task #999 not found');
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_TASK_NOT_FOUND);
        });
        test('should reject invalid task ID', () => {
            const result = service.deleteTask(0);
            expect(result.success).toBe(false);
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_INVALID_ID);
        });
    });
    describe('updateTask', () => {
        test('should update task description', () => {
            service.addTask('Original description');
            const result = service.updateTask(1, 'Updated description');
            expect(result.success).toBe(true);
            const task = service.getTaskById(1);
            expect(task?.description).toBe('Updated description');
        });
        test('should preserve task ID and completed status', () => {
            service.addTask('Task');
            service.completeTask(1);
            service.updateTask(1, 'New description');
            const task = service.getTaskById(1);
            expect(task?.id).toBe(1);
            expect(task?.completed).toBe(true);
        });
        test('should trim new description', () => {
            service.addTask('Task');
            service.updateTask(1, '  Trimmed  ');
            const task = service.getTaskById(1);
            expect(task?.description).toBe('Trimmed');
        });
        test('should return error for non-existent task', () => {
            const result = service.updateTask(999, 'New description');
            expect(result.success).toBe(false);
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_TASK_NOT_FOUND);
        });
        test('should validate new description', () => {
            service.addTask('Task');
            const result = service.updateTask(1, '');
            expect(result.success).toBe(false);
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_EMPTY_DESC);
        });
    });
    describe('getAllTasks', () => {
        test('should return empty array when no tasks', () => {
            const result = service.getAllTasks();
            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(0);
        });
        test('should return all tasks in order of creation', () => {
            service.addTask('First task');
            service.addTask('Second task');
            service.addTask('Third task');
            const result = service.getAllTasks();
            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(3);
            if (Array.isArray(result.data)) {
                expect(result.data[0].description).toBe('First task');
                expect(result.data[1].description).toBe('Second task');
                expect(result.data[2].description).toBe('Third task');
            }
        });
        test('should not include deleted tasks', () => {
            service.addTask('Task 1');
            service.addTask('Task 2');
            service.addTask('Task 3');
            service.deleteTask(2);
            const result = service.getAllTasks();
            expect(result.data).toHaveLength(2);
        });
    });
    describe('toggleTask', () => {
        test('should toggle incomplete to complete', () => {
            service.addTask('Task');
            const result = service.toggleTask(1);
            expect(result.success).toBe(true);
            const task = service.getTaskById(1);
            expect(task?.completed).toBe(true);
        });
        test('should toggle complete to incomplete', () => {
            service.addTask('Task');
            service.completeTask(1);
            const result = service.toggleTask(1);
            expect(result.success).toBe(true);
            const task = service.getTaskById(1);
            expect(task?.completed).toBe(false);
        });
        test('should return error for non-existent task', () => {
            const result = service.toggleTask(999);
            expect(result.success).toBe(false);
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_TASK_NOT_FOUND);
        });
    });
    describe('completeTask', () => {
        test('should mark task as complete', () => {
            service.addTask('Task');
            const result = service.completeTask(1);
            expect(result.success).toBe(true);
            const task = service.getTaskById(1);
            expect(task?.completed).toBe(true);
        });
        test('should keep task complete if already complete', () => {
            service.addTask('Task');
            service.completeTask(1);
            service.completeTask(1);
            const task = service.getTaskById(1);
            expect(task?.completed).toBe(true);
        });
        test('should return error for non-existent task', () => {
            const result = service.completeTask(999);
            expect(result.success).toBe(false);
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_TASK_NOT_FOUND);
        });
    });
    describe('incompleteTask', () => {
        test('should mark task as incomplete', () => {
            service.addTask('Task');
            service.completeTask(1);
            const result = service.incompleteTask(1);
            expect(result.success).toBe(true);
            const task = service.getTaskById(1);
            expect(task?.completed).toBe(false);
        });
        test('should keep task incomplete if already incomplete', () => {
            service.addTask('Task');
            service.incompleteTask(1);
            const task = service.getTaskById(1);
            expect(task?.completed).toBe(false);
        });
        test('should return error for non-existent task', () => {
            const result = service.incompleteTask(999);
            expect(result.success).toBe(false);
            expect(result.errorCode).toBe(task_1.ErrorCode.ERR_TASK_NOT_FOUND);
        });
    });
    describe('getTaskById', () => {
        test('should return task if exists', () => {
            service.addTask('Test task');
            const task = service.getTaskById(1);
            expect(task).toBeDefined();
            expect(task?.description).toBe('Test task');
        });
        test('should return undefined if task does not exist', () => {
            const task = service.getTaskById(999);
            expect(task).toBeUndefined();
        });
    });
});
//# sourceMappingURL=taskService.test.js.map