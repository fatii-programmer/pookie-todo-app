# Evolution of Todo - Phase I Specification

**Version:** 1.0.0
**Date:** 2025-12-31
**Status:** Ready for Implementation
**Governed By:** CONSTITUTION.md v1.0.0

---

## Table of Contents
1. [Overview](#overview)
2. [Functional Requirements](#functional-requirements)
3. [Non-Functional Requirements](#non-functional-requirements)
4. [Data Model](#data-model)
5. [CLI Behavior](#cli-behavior)
6. [User Flows](#user-flows)
7. [Error Handling](#error-handling)
8. [Acceptance Criteria](#acceptance-criteria)

---

## Overview

### Purpose
Phase I delivers a minimal viable console-based Todo application that allows a single user to manage a list of tasks through a command-line interface.

### Scope
This specification defines the complete behavior, data structures, and user interactions for the five core features:
1. Add Task
2. Delete Task
3. Update Task
4. View Task List
5. Mark Task Complete/Incomplete

### Out of Scope
- Persistent storage (data resets when application exits)
- Multiple users or task lists
- Task priorities, categories, or tags
- Due dates or reminders
- Search or filter functionality
- Task history or audit trail
- Configuration files

---

## Functional Requirements

### FR-1: Add Task
**ID:** FR-1
**Priority:** Critical
**Description:** User can create a new task with a description.

**Details:**
- User provides a task description (text string)
- System assigns a unique numeric ID to the task
- Task is added to the task list in order of creation
- Task initially has status "incomplete"
- Task description must be 1-500 characters
- System provides confirmation with assigned task ID

**Inputs:**
- Task description (string, 1-500 characters, required)

**Outputs:**
- Success message with task ID
- OR error message if validation fails

---

### FR-2: Delete Task
**ID:** FR-2
**Priority:** Critical
**Description:** User can permanently remove a task from the list by its ID.

**Details:**
- User provides the task ID to delete
- System removes the task from the list
- Task IDs are not reused after deletion
- System provides confirmation of deletion
- Deleting a non-existent task is an error

**Inputs:**
- Task ID (positive integer, required)

**Outputs:**
- Success message confirming deletion
- OR error message if task ID not found

---

### FR-3: Update Task
**ID:** FR-3
**Priority:** Critical
**Description:** User can modify the description of an existing task.

**Details:**
- User provides task ID and new description
- System updates the task description
- Task ID and completion status remain unchanged
- New description must meet same validation as FR-1
- Updating a non-existent task is an error

**Inputs:**
- Task ID (positive integer, required)
- New task description (string, 1-500 characters, required)

**Outputs:**
- Success message confirming update
- OR error message if task ID not found or validation fails

---

### FR-4: View Task List
**ID:** FR-4
**Priority:** Critical
**Description:** User can view all tasks in the list with their current status.

**Details:**
- System displays all tasks in order of creation (oldest first)
- Each task shows: ID, status indicator, and description
- Status indicator: `[ ]` for incomplete, `[x]` for complete
- Empty list shows a message indicating no tasks exist
- Display format must be clear and readable

**Inputs:**
- None

**Outputs:**
- Formatted list of all tasks
- OR message "No tasks found" if list is empty

**Display Format:**
```
1. [ ] Task description here
2. [x] Completed task description
3. [ ] Another incomplete task
```

---

### FR-5: Mark Task Complete/Incomplete
**ID:** FR-5
**Priority:** Critical
**Description:** User can toggle the completion status of a task.

**Details:**
- User provides task ID to toggle
- System switches status: incomplete → complete OR complete → incomplete
- Task ID and description remain unchanged
- System provides confirmation showing new status
- Marking a non-existent task is an error

**Inputs:**
- Task ID (positive integer, required)

**Outputs:**
- Success message showing new status (complete or incomplete)
- OR error message if task ID not found

---

## Non-Functional Requirements

### NFR-1: Performance
- Application must start within 2 seconds on standard hardware
- All operations (add, delete, update, view, toggle) must complete within 100ms for lists up to 1000 tasks
- Memory usage must not exceed 50MB for lists up to 1000 tasks

### NFR-2: Usability
- All commands must be single-word or simple phrases
- Error messages must clearly explain what went wrong and how to fix it
- Help information must be available on demand
- Command names must be intuitive and follow common CLI conventions

### NFR-3: Reliability
- Application must not crash on invalid input
- All user input must be validated before processing
- Invalid operations must be reported, not silently ignored
- Application must maintain data integrity (no duplicate IDs, no orphaned tasks)

### NFR-4: Maintainability
- Code must follow TypeScript strict mode
- All public functions must have JSDoc comments
- Test coverage must be ≥80%
- Code must pass ESLint with zero warnings

### NFR-5: Portability
- Application must run on Windows, macOS, and Linux
- Must work with Node.js LTS versions (18.x or higher)
- No OS-specific dependencies

---

## Data Model

### Task Entity

**TypeScript Interface Definition:**

```typescript
interface Task {
  id: number;           // Unique identifier, positive integer, auto-generated
  description: string;  // Task description, 1-500 characters
  completed: boolean;   // Completion status, default false
  createdAt: Date;      // Timestamp when task was created
}
```

**Field Specifications:**

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| `id` | number | Positive integer, unique, auto-increment | Auto-generated | Unique task identifier |
| `description` | string | Length: 1-500 chars, non-empty after trim | None | Task description text |
| `completed` | boolean | true or false | false | Task completion status |
| `createdAt` | Date | Valid Date object | new Date() | Creation timestamp |

**Business Rules:**
- Task IDs start at 1 and increment sequentially
- Task IDs are never reused, even after deletion
- Description is trimmed of leading/trailing whitespace before storage
- Empty or whitespace-only descriptions are invalid
- Tasks are stored in-memory (data lost on application exit)

---

## CLI Behavior

### Application Entry Point

**Start Command:**
```bash
npm start
```

**Initial Display:**
```
╔════════════════════════════════════════╗
║     Evolution of Todo - Phase I        ║
║         Task Management System         ║
╔════════════════════════════════════════╗

Type 'help' for available commands or 'exit' to quit.

>
```

### Command Interface

**Input Format:**
- Command-based interface with prompt `>`
- Commands are case-insensitive
- Arguments separated by spaces (or collected via prompts)

**Available Commands:**

| Command | Aliases | Description |
|---------|---------|-------------|
| `add` | `a`, `new` | Add a new task |
| `delete <id>` | `del`, `remove`, `rm` | Delete a task |
| `update <id>` | `edit`, `modify` | Update a task description |
| `list` | `ls`, `view`, `all` | View all tasks |
| `complete <id>` | `done`, `finish` | Mark task as complete |
| `incomplete <id>` | `undone`, `todo` | Mark task as incomplete |
| `toggle <id>` | `t` | Toggle task completion status |
| `help` | `h`, `?` | Show help information |
| `exit` | `quit`, `q` | Exit application |

### Command Execution Patterns

#### Pattern A: Single Command (List, Help, Exit)
```
> list
1. [ ] Buy groceries
2. [x] Complete project
3. [ ] Call dentist

>
```

#### Pattern B: Command with Inline Argument (Delete, Complete, Toggle)
```
> delete 2
✓ Task #2 deleted successfully.

>
```

#### Pattern C: Command with Prompted Input (Add, Update)
```
> add
Enter task description: Buy groceries
✓ Task #1 added successfully.

>
```

OR with inline input:
```
> add Buy groceries
✓ Task #1 added successfully.

>
```

### Help Display

When user types `help`, display:

```
Available Commands:
------------------
  add [description]       Add a new task
  delete <id>             Delete a task by ID
  update <id>             Update task description
  list                    View all tasks
  complete <id>           Mark task as complete
  incomplete <id>         Mark task as incomplete
  toggle <id>             Toggle task completion status
  help                    Show this help message
  exit                    Exit the application

Examples:
---------
  > add Buy groceries
  > list
  > complete 1
  > update 2
  > delete 3

>
```

---

## User Flows

### Flow 1: Add New Task

**Trigger:** User enters `add` command

**Steps:**
1. System displays prompt: "Enter task description:"
2. User enters task description
3. System validates description (1-500 chars, non-empty after trim)
4. IF valid:
   - System generates new unique ID
   - System creates Task object with completed=false
   - System adds task to list
   - System displays: "✓ Task #{id} added successfully."
5. IF invalid:
   - System displays appropriate error message
   - Return to command prompt (do not retry automatically)
6. Return to command prompt

**Alternative Flow (Inline):**
1. User enters `add Buy groceries`
2. System parses "Buy groceries" as description
3. Continue from step 3 above

---

### Flow 2: View Task List

**Trigger:** User enters `list` command

**Steps:**
1. System retrieves all tasks ordered by creation time
2. IF list is empty:
   - Display: "No tasks found. Use 'add' to create a task."
3. IF list has tasks:
   - Display header: "Your Tasks:"
   - For each task, display: `{id}. [{status}] {description}`
   - Status: `x` if completed, space if incomplete
4. Return to command prompt

**Example Output:**
```
Your Tasks:
-----------
1. [ ] Buy groceries
2. [x] Complete project report
3. [ ] Schedule dentist appointment
4. [ ] Read documentation

>
```

---

### Flow 3: Delete Task

**Trigger:** User enters `delete <id>` command

**Steps:**
1. System parses task ID from command
2. IF ID is missing or invalid format:
   - Display: "Error: Please provide a valid task ID. Usage: delete <id>"
   - Return to command prompt
3. System searches for task with given ID
4. IF task not found:
   - Display: "Error: Task #{id} not found."
   - Return to command prompt
5. IF task found:
   - System removes task from list
   - Display: "✓ Task #{id} deleted successfully."
6. Return to command prompt

---

### Flow 4: Update Task Description

**Trigger:** User enters `update <id>` command

**Steps:**
1. System parses task ID from command
2. IF ID is missing or invalid format:
   - Display: "Error: Please provide a valid task ID. Usage: update <id>"
   - Return to command prompt
3. System searches for task with given ID
4. IF task not found:
   - Display: "Error: Task #{id} not found."
   - Return to command prompt
5. IF task found:
   - Display current description: "Current: {description}"
   - Display prompt: "Enter new description:"
   - User enters new description
   - System validates new description
   - IF valid:
     - System updates task description
     - Display: "✓ Task #{id} updated successfully."
   - IF invalid:
     - Display appropriate error message
6. Return to command prompt

---

### Flow 5: Toggle Task Completion

**Trigger:** User enters `toggle <id>`, `complete <id>`, or `incomplete <id>` command

**Steps (for toggle):**
1. System parses task ID from command
2. IF ID is missing or invalid format:
   - Display: "Error: Please provide a valid task ID. Usage: toggle <id>"
   - Return to command prompt
3. System searches for task with given ID
4. IF task not found:
   - Display: "Error: Task #{id} not found."
   - Return to command prompt
5. IF task found:
   - System toggles completed status (true ↔ false)
   - Display: "✓ Task #{id} marked as {complete/incomplete}."
6. Return to command prompt

**Steps (for complete):**
1-4. Same as toggle
5. System sets completed = true (regardless of current status)
6. Display: "✓ Task #{id} marked as complete."
7. Return to command prompt

**Steps (for incomplete):**
1-4. Same as toggle
5. System sets completed = false (regardless of current status)
6. Display: "✓ Task #{id} marked as incomplete."
7. Return to command prompt

---

### Flow 6: Exit Application

**Trigger:** User enters `exit` command

**Steps:**
1. System displays: "Goodbye! Your tasks will not be saved."
2. Application terminates gracefully
3. Exit code 0

---

## Error Handling

### Input Validation Errors

| Error Condition | Error Message | Error Code |
|----------------|---------------|------------|
| Task description empty | "Error: Task description cannot be empty." | ERR_EMPTY_DESC |
| Task description too long | "Error: Task description must be 500 characters or less. (Current: {count})" | ERR_DESC_TOO_LONG |
| Task description only whitespace | "Error: Task description cannot be only whitespace." | ERR_WHITESPACE_DESC |
| Invalid task ID format | "Error: Task ID must be a positive integer." | ERR_INVALID_ID |
| Task ID not found | "Error: Task #{id} not found." | ERR_TASK_NOT_FOUND |
| Unknown command | "Error: Unknown command '{command}'. Type 'help' for available commands." | ERR_UNKNOWN_CMD |
| Missing required argument | "Error: Missing required argument. Usage: {usage}" | ERR_MISSING_ARG |

### System Errors

| Error Condition | Error Message | Behavior |
|----------------|---------------|----------|
| Unexpected exception | "Error: An unexpected error occurred. Please try again." | Log error, return to prompt |
| Out of memory | "Error: Cannot add more tasks (memory limit reached)." | Return to prompt |
| Invalid operation | "Error: Operation failed. {reason}" | Return to prompt |

### Error Display Format

```
✗ {Error Message}

>
```

### Error Handling Principles

1. **Never crash:** All errors must be caught and handled gracefully
2. **Clear messages:** Users must understand what went wrong
3. **Actionable:** Error messages should guide users to correct action
4. **Consistent format:** All errors use ✗ symbol prefix
5. **Logging:** All errors should be logged (console.error) for debugging
6. **Recovery:** Application always returns to command prompt after error

---

## Acceptance Criteria

### AC-1: Basic Functionality
- [ ] User can add a task with a valid description
- [ ] User can delete an existing task by ID
- [ ] User can update an existing task's description
- [ ] User can view all tasks in a formatted list
- [ ] User can mark a task as complete
- [ ] User can mark a task as incomplete
- [ ] User can toggle task completion status
- [ ] User can exit the application

### AC-2: Data Integrity
- [ ] Task IDs are unique and never reused
- [ ] Task IDs increment sequentially starting from 1
- [ ] Tasks maintain their order by creation time
- [ ] Completed status persists across operations
- [ ] No duplicate tasks can be created

### AC-3: Input Validation
- [ ] Empty descriptions are rejected
- [ ] Whitespace-only descriptions are rejected
- [ ] Descriptions over 500 characters are rejected
- [ ] Invalid task IDs are rejected
- [ ] Non-existent task IDs produce appropriate errors
- [ ] Unknown commands produce helpful error messages

### AC-4: CLI Behavior
- [ ] Application starts with welcome message
- [ ] Command prompt (>) is displayed and functional
- [ ] Commands are case-insensitive
- [ ] Help command displays all available commands
- [ ] Exit command terminates application gracefully
- [ ] All success operations show confirmation messages
- [ ] All errors show clear error messages

### AC-5: User Experience
- [ ] Empty task list shows helpful message
- [ ] Task list displays completion status visually
- [ ] All messages use consistent formatting
- [ ] User is always returned to command prompt
- [ ] Application never crashes on invalid input

### AC-6: Code Quality
- [ ] All code written in TypeScript with strict mode
- [ ] Zero TypeScript compilation errors
- [ ] Zero TypeScript compilation warnings
- [ ] Zero ESLint errors
- [ ] All functions have explicit return types
- [ ] Task interface matches specification exactly

### AC-7: Testing
- [ ] Unit tests for all business logic functions
- [ ] Tests for all five core features
- [ ] Tests for all validation rules
- [ ] Tests for all error conditions
- [ ] Overall test coverage ≥80%
- [ ] All tests pass

### AC-8: Documentation
- [ ] README.md with installation instructions
- [ ] README.md with usage examples
- [ ] All public functions have JSDoc comments
- [ ] CHANGELOG.md created with Phase I entry

### AC-9: Performance
- [ ] Application starts in under 2 seconds
- [ ] All operations complete in under 100ms (for lists up to 100 tasks)
- [ ] No memory leaks during normal operation

### AC-10: Cross-Platform
- [ ] Application runs on Windows
- [ ] Application runs on macOS
- [ ] Application runs on Linux
- [ ] No OS-specific code or dependencies

---

## Implementation Notes

### Suggested Module Structure
```
src/
  ├── models/
  │   └── task.ts          // Task interface and related types
  ├── services/
  │   └── taskService.ts   // Business logic for task operations
  ├── ui/
  │   └── cli.ts           // Command-line interface handling
  ├── utils/
  │   └── validators.ts    // Input validation functions
  └── index.ts             // Application entry point
```

### Testing Strategy
- Unit test each business logic function in isolation
- Mock console I/O for CLI testing
- Test edge cases (empty lists, invalid IDs, boundary values)
- Test error handling paths

### Dependencies
Permitted dependencies (must be justified):
- `@types/node` - TypeScript definitions for Node.js
- Testing framework (Jest or similar)
- ESLint and TypeScript ESLint plugins
- Prettier (optional, for code formatting)

No external libraries for core functionality (prompts, CLI frameworks, etc.) unless approved.

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-12-31 | Human Architect | Initial specification |

---

## Approval

**Specification Status:** Ready for Implementation

**Next Steps:**
1. Hand off specification to Claude Code
2. Claude Code implements according to this specification
3. Human reviews implementation against acceptance criteria
4. Human approves or requests revisions

---

**Document Owner:** Human Architect
**Implementation Owner:** Claude Code
**Governed By:** CONSTITUTION.md v1.0.0
