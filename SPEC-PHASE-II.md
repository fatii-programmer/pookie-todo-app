# Evolution of Todo - Phase II Specification

**Version:** 2.0.0
**Date:** 2025-12-31
**Status:** Ready for Implementation
**Governed By:** CONSTITUTION.md v1.0.0
**Extends:** SPEC-PHASE-I.md v1.0.0

---

## Table of Contents
1. [Overview](#overview)
2. [Changes from Phase I](#changes-from-phase-i)
3. [Functional Requirements](#functional-requirements)
4. [Non-Functional Requirements](#non-functional-requirements)
5. [Data Model](#data-model)
6. [CLI Behavior](#cli-behavior)
7. [User Flows](#user-flows)
8. [Error Handling](#error-handling)
9. [Acceptance Criteria](#acceptance-criteria)
10. [Migration from Phase I](#migration-from-phase-i)

---

## Overview

### Purpose
Phase II extends the Phase I Todo application with organization features including task priorities, tags, search capabilities, filtering, and sorting. This phase maintains full backward compatibility with Phase I while adding powerful task management capabilities.

### Scope
This specification adds the following capabilities to Phase I:
1. **Task Priority** - Assign priority levels (high, medium, low) to tasks
2. **Tags** - Apply multiple tags to tasks for categorization
3. **Search** - Find tasks by keyword in description or tags
4. **Filter** - View tasks filtered by status, priority, or tags
5. **Sort** - Display tasks sorted by priority, due date, or name

### Backward Compatibility
- All Phase I commands continue to work unchanged
- Existing tasks without priority default to "medium"
- Existing tasks without tags have empty tag list
- Tasks without due dates can still be created

---

## Changes from Phase I

### Breaking Changes
**NONE** - Phase II is fully backward compatible with Phase I.

### New Features
1. Task priority system (high/medium/low)
2. Task tagging system (multiple tags per task)
3. Optional due date for tasks
4. Search command to find tasks by keyword
5. Filter command to filter tasks by criteria
6. Sort command to reorder task display
7. Enhanced list view with priority and tag display

### Modified Features
1. **Add Task** - Now accepts optional priority, tags, and due date
2. **Update Task** - Can now update priority, tags, and due date
3. **List Tasks** - Enhanced display shows priority, tags, and due date

### Deprecated Features
**NONE** - All Phase I features retained.

---

## Functional Requirements

### FR-6: Task Priority
**ID:** FR-6
**Priority:** High
**Description:** User can assign and modify priority levels for tasks.

**Details:**
- Three priority levels: `high`, `medium`, `low`
- Default priority for new tasks: `medium`
- Priority can be set during task creation
- Priority can be modified after creation
- Priority affects visual display (color/symbol)

**Priority Levels:**
| Level | Display Symbol | Description |
|-------|---------------|-------------|
| high | `!!!` | Urgent, important tasks |
| medium | `!!` | Normal priority tasks (default) |
| low | `!` | Nice to have, can wait |

**Inputs:**
- Priority level: `high`, `medium`, or `low`

**Outputs:**
- Success confirmation with priority indicator
- OR error if invalid priority value

---

### FR-7: Task Tags
**ID:** FR-7
**Priority:** High
**Description:** User can apply multiple tags to tasks for categorization.

**Details:**
- Tasks can have zero or more tags
- Tags are single-word labels (no spaces)
- Tags are case-insensitive (stored lowercase)
- Tags are 1-20 characters, alphanumeric plus hyphen/underscore
- Multiple tags displayed comma-separated
- Tags can be added/removed individually or in batch

**Tag Format:**
- Valid: `work`, `personal`, `urgent`, `bug-fix`, `phase_2`
- Invalid: `two words`, `a`, `averylongtagnamethatisinvalid`, `@special`

**Inputs:**
- Tag(s) to add/remove (space or comma-separated)

**Outputs:**
- Success confirmation with updated tag list
- OR error if invalid tag format

---

### FR-8: Task Due Date
**ID:** FR-8
**Priority:** Medium
**Description:** User can assign optional due dates to tasks.

**Details:**
- Due date is optional (tasks can have no due date)
- Date format: `YYYY-MM-DD` (ISO 8601)
- Due dates can be in the past (for tracking overdue tasks)
- Due date can be set during creation or added later
- Due date can be removed (set to null)
- Display shows "overdue" indicator for past dates

**Inputs:**
- Due date in `YYYY-MM-DD` format
- OR `none` to remove due date

**Outputs:**
- Success confirmation with due date
- OR error if invalid date format

---

### FR-9: Search Tasks by Keyword
**ID:** FR-9
**Priority:** High
**Description:** User can search for tasks by keyword in description or tags.

**Details:**
- Search is case-insensitive
- Searches task descriptions and tags
- Returns all tasks matching the keyword
- Partial word matching supported
- Empty results show helpful message
- Search results sorted by relevance (exact match first)

**Inputs:**
- Search keyword (string, 1-100 characters)

**Outputs:**
- List of matching tasks with match highlighting
- Count of results found
- OR message if no matches

**Examples:**
- Search `"buy"` matches: "Buy groceries", "Budget review"
- Search `"urgent"` matches tasks tagged with `urgent`

---

### FR-10: Filter Tasks
**ID:** FR-10
**Priority:** High
**Description:** User can filter task list by status, priority, and/or tags.

**Details:**
- Filter by completion status: `complete`, `incomplete`, `all`
- Filter by priority: `high`, `medium`, `low`, `any`
- Filter by tag: one or more tags (OR logic)
- Multiple filters can be combined (AND logic)
- Filter state persists until cleared or changed
- Filtered view affects list, search, and sort commands

**Filter Combinations:**
- Status + Priority: Show all incomplete high-priority tasks
- Tag + Status: Show all complete tasks tagged `work`
- Priority + Tag: Show all high-priority tasks tagged `urgent`

**Inputs:**
- Filter criteria (status, priority, tag)

**Outputs:**
- Confirmation of active filters
- Filtered task count
- OR message if no tasks match filter

---

### FR-11: Sort Tasks
**ID:** FR-11
**Priority:** Medium
**Description:** User can sort task list by various criteria.

**Details:**
- Sort by priority: high → medium → low
- Sort by due date: earliest → latest (no date shown last)
- Sort by name: alphabetical (A → Z)
- Sort by creation date: oldest → first (default)
- Sort order persists until changed
- Sorted view affects list and filter results

**Sort Options:**
| Criterion | Order | Description |
|-----------|-------|-------------|
| `priority` | High → Medium → Low | Descending priority |
| `due-date` | Earliest → Latest | Ascending date (no date last) |
| `name` | A → Z | Alphabetical by description |
| `created` | Oldest → Newest | Creation order (default) |

**Inputs:**
- Sort criterion keyword

**Outputs:**
- Confirmation of active sort
- Re-ordered task list

---

## Non-Functional Requirements

### NFR-1: Performance (Updated)
- Application must start within 2 seconds
- All operations must complete within 100ms for lists up to 10,000 tasks
- Search must complete within 200ms for lists up to 10,000 tasks
- Memory usage must not exceed 100MB for lists up to 10,000 tasks

### NFR-2: Usability (Enhanced)
- All new commands follow Phase I naming conventions
- Priority and tag display must be visually distinct
- Filter and sort state clearly indicated in UI
- Search results highlight matched terms
- Due date display includes overdue warnings

### NFR-3: Data Integrity (Enhanced)
- Tags validated before storage
- Priority values restricted to valid set
- Due dates validated as proper dates
- Filter/sort state does not affect underlying data
- Case-insensitive tag comparison

### NFR-4: Backward Compatibility
- Phase I tasks auto-migrate with default values
- All Phase I commands work identically
- Phase I test suite passes against Phase II
- No changes to Phase I data model structure (only additions)

---

## Data Model

### Task Entity (Extended)

**TypeScript Interface Definition:**

```typescript
interface Task {
  // Phase I fields (unchanged)
  id: number;
  description: string;
  completed: boolean;
  createdAt: Date;

  // Phase II additions
  priority: Priority;
  tags: string[];
  dueDate: Date | null;
}

type Priority = 'high' | 'medium' | 'low';
```

**Field Specifications:**

| Field | Type | Constraints | Default | Phase |
|-------|------|-------------|---------|-------|
| `id` | number | Positive integer, unique | Auto-generated | I |
| `description` | string | 1-500 chars | None | I |
| `completed` | boolean | true/false | false | I |
| `createdAt` | Date | Valid Date | new Date() | I |
| `priority` | Priority | 'high', 'medium', 'low' | 'medium' | II |
| `tags` | string[] | Each tag: 1-20 chars, lowercase | [] | II |
| `dueDate` | Date \| null | Valid Date or null | null | II |

**Tag Validation Rules:**
- Pattern: `/^[a-z0-9_-]+$/`
- Length: 1-20 characters
- Stored in lowercase
- No duplicates within a task
- Array can be empty

**Priority Validation Rules:**
- Must be exactly one of: `'high'`, `'medium'`, `'low'`
- Case-insensitive input, normalized to lowercase

**Due Date Validation Rules:**
- Format: ISO 8601 date string (`YYYY-MM-DD`)
- Must be valid calendar date
- Can be past, present, or future
- Can be null (no due date)

---

## CLI Behavior

### Updated Commands (Phase I Extended)

#### Add Command (Extended)
```
add [description] [--priority <level>] [--tags <tag1,tag2>] [--due <date>]
```

**Examples:**
```
> add Buy groceries --priority high --tags shopping,personal
✓ Task #1 added successfully. [Priority: high] [Tags: shopping, personal]

> add Review code --due 2025-01-15
✓ Task #2 added successfully. [Due: 2025-01-15]

> add Call dentist
✓ Task #3 added successfully. [Priority: medium]
```

#### Update Command (Extended)
```
update <id> [--description <text>] [--priority <level>] [--tags <tags>] [--due <date>]
```

**Examples:**
```
> update 1 --priority low
✓ Task #1 updated successfully. [Priority: low]

> update 2 --tags work,urgent --due 2025-01-10
✓ Task #2 updated successfully. [Tags: work, urgent] [Due: 2025-01-10]

> update 3 --description Call dentist tomorrow
✓ Task #3 updated successfully.
```

#### List Command (Enhanced Display)
```
list [--compact]
```

**Enhanced Display Format:**
```
Your Tasks:
-----------
1. [!!!] [ ] Buy groceries [Due: 2025-01-05 OVERDUE] #shopping #personal
2. [!!]  [x] Review code [Due: 2025-01-15] #work #urgent
3. [!]   [ ] Call dentist #personal
```

**Compact Format:**
```
1. [!!!][ ] Buy groceries
2. [!!][x] Review code
3. [!][ ] Call dentist
```

### New Commands (Phase II)

#### Search Command
```
search <keyword>
s <keyword>
find <keyword>
```

**Description:** Search for tasks by keyword in description or tags.

**Examples:**
```
> search grocery
Found 1 task(s):
-----------
1. [!!!] [ ] Buy groceries [Due: 2025-01-05 OVERDUE] #shopping #personal

> search urgent
Found 2 task(s):
-----------
2. [!!] [x] Review code [Due: 2025-01-15] #work #urgent
5. [!!!] [ ] Fix critical bug #urgent #bug
```

#### Filter Command
```
filter [--status <complete|incomplete|all>] [--priority <level>] [--tag <tag>]
filter clear
```

**Description:** Filter task display by criteria.

**Examples:**
```
> filter --status incomplete --priority high
Applied filters: status=incomplete, priority=high
Showing 2 task(s)

> filter --tag work
Applied filters: tag=work
Showing 5 task(s)

> filter clear
✓ All filters cleared.
```

#### Sort Command
```
sort <priority|due-date|name|created>
sort reset
```

**Description:** Change task display order.

**Examples:**
```
> sort priority
✓ Sorting by: priority (high → low)

> sort due-date
✓ Sorting by: due-date (earliest → latest)

> sort reset
✓ Sorting reset to: created (oldest → newest)
```

#### Tag Management Commands
```
tag add <id> <tag1> [tag2] [tag3]
tag remove <id> <tag1> [tag2]
tag list
```

**Description:** Manage task tags.

**Examples:**
```
> tag add 1 urgent important
✓ Added tags to task #1: urgent, important

> tag remove 1 important
✓ Removed tags from task #1: important

> tag list
Available tags:
- urgent (5 tasks)
- work (8 tasks)
- personal (3 tasks)
- shopping (1 task)
```

#### Priority Command
```
priority <id> <high|medium|low>
pri <id> <level>
```

**Description:** Change task priority (shorthand for update --priority).

**Examples:**
```
> priority 1 high
✓ Task #1 priority set to: high

> pri 2 low
✓ Task #2 priority set to: low
```

#### Due Date Command
```
due <id> <YYYY-MM-DD>
due <id> none
```

**Description:** Set or remove task due date.

**Examples:**
```
> due 1 2025-01-15
✓ Task #1 due date set to: 2025-01-15

> due 2 none
✓ Task #2 due date removed.
```

### Updated Help Display

```
Available Commands:
------------------
Task Management:
  add [description] [options]  Add a new task
  delete <id>                  Delete a task by ID
  update <id> [options]        Update task properties
  list [--compact]             View all tasks
  complete <id>                Mark task as complete
  incomplete <id>              Mark task as incomplete
  toggle <id>                  Toggle task completion status

Organization:
  priority <id> <level>        Set task priority (high/medium/low)
  tag add <id> <tags>          Add tags to task
  tag remove <id> <tags>       Remove tags from task
  tag list                     List all tags with usage count
  due <id> <date|none>         Set or remove due date (YYYY-MM-DD)

Search & Filter:
  search <keyword>             Search tasks by keyword
  filter [options]             Filter tasks by criteria
  filter clear                 Clear all filters
  sort <criterion>             Sort tasks (priority/due-date/name/created)
  sort reset                   Reset to default sort

General:
  help                         Show this help message
  exit                         Exit the application

Options for add/update:
  --priority <level>           Set priority (high/medium/low)
  --tags <tag1,tag2>           Set tags (comma-separated)
  --due <YYYY-MM-DD>           Set due date
  --description <text>         Set description

Examples:
---------
  > add Buy groceries --priority high --tags shopping
  > update 1 --priority low --due 2025-01-15
  > search urgent
  > filter --status incomplete --priority high
  > sort priority
  > tag add 1 work important
  > priority 2 high
  > due 3 2025-02-01
```

---

## User Flows

### Flow 6: Add Task with Priority and Tags

**Trigger:** User enters `add` command with options

**Steps:**
1. User enters: `add Buy groceries --priority high --tags shopping,personal`
2. System parses description: "Buy groceries"
3. System parses priority: "high"
4. System parses tags: ["shopping", "personal"]
5. System validates description (1-500 chars)
6. System validates priority (high/medium/low)
7. System validates each tag (1-20 chars, valid pattern)
8. IF all valid:
   - System creates Task with id, description, priority, tags
   - System sets completed=false, dueDate=null, createdAt=now
   - Display: "✓ Task #1 added successfully. [Priority: high] [Tags: shopping, personal]"
9. IF any validation fails:
   - Display appropriate error message
10. Return to command prompt

**Alternative Flow (Prompted):**
1. User enters: `add`
2. System prompts: "Enter task description:"
3. User enters description
4. System prompts: "Priority (high/medium/low) [medium]:"
5. User enters priority or presses Enter for default
6. System prompts: "Tags (comma-separated) [none]:"
7. User enters tags or presses Enter for none
8. System prompts: "Due date (YYYY-MM-DD) [none]:"
9. User enters date or presses Enter for none
10. Continue from step 5 above

---

### Flow 7: Search Tasks by Keyword

**Trigger:** User enters `search <keyword>` command

**Steps:**
1. User enters: `search urgent`
2. System validates keyword (not empty, 1-100 chars)
3. System searches all tasks:
   - Check if keyword appears in description (case-insensitive)
   - Check if keyword matches any tag (case-insensitive)
4. System collects matching tasks
5. IF matches found:
   - Display: "Found {count} task(s):"
   - Display separator line
   - For each match, display full task info with highlight
6. IF no matches:
   - Display: "No tasks found matching '{keyword}'."
7. Return to command prompt

**Matching Logic:**
- Exact tag match: `urgent` matches tag "urgent" (highest priority)
- Substring match: `groc` matches "Buy groceries"
- Case-insensitive: `URGENT` matches "urgent"

---

### Flow 8: Filter Tasks by Criteria

**Trigger:** User enters `filter` command with options

**Steps:**
1. User enters: `filter --status incomplete --priority high`
2. System parses filter options:
   - status: incomplete
   - priority: high
3. System validates each filter value
4. IF valid:
   - System stores filter state
   - System applies filters to task list
   - Count matching tasks
   - Display: "Applied filters: status=incomplete, priority=high"
   - Display: "Showing {count} task(s)"
5. IF invalid filter value:
   - Display error message
6. Return to command prompt

**Filter Clear Flow:**
1. User enters: `filter clear`
2. System resets all filter state
3. Display: "✓ All filters cleared."
4. Return to command prompt

**Filter Persistence:**
- Filters remain active until cleared or changed
- `list` command respects active filters
- `search` command searches within filtered results
- Status line shows active filters

---

### Flow 9: Sort Tasks

**Trigger:** User enters `sort <criterion>` command

**Steps:**
1. User enters: `sort priority`
2. System validates sort criterion
3. IF valid:
   - System stores sort state
   - System applies sort to task list
   - Display: "✓ Sorting by: priority (high → low)"
4. IF invalid:
   - Display: "Error: Invalid sort criterion. Use: priority, due-date, name, or created."
5. Return to command prompt

**Sort Logic by Criterion:**

**Priority Sort:**
- Order: high > medium > low
- Secondary: creation date (oldest first)

**Due Date Sort:**
- Order: earliest → latest
- Tasks without due date shown last
- Secondary: priority (high first)

**Name Sort:**
- Order: alphabetical (A → Z)
- Case-insensitive
- Secondary: creation date

**Created Sort (Default):**
- Order: oldest → newest (Phase I behavior)

---

### Flow 10: Manage Tags

**Trigger:** User enters tag management command

**Add Tags Flow:**
1. User enters: `tag add 1 work urgent`
2. System validates task ID exists
3. System validates each tag format
4. System converts tags to lowercase
5. System adds tags (skips duplicates)
6. Display: "✓ Added tags to task #1: work, urgent"
7. Return to command prompt

**Remove Tags Flow:**
1. User enters: `tag remove 1 urgent`
2. System validates task ID exists
3. System removes specified tags (ignores non-existent)
4. Display: "✓ Removed tags from task #1: urgent"
5. Return to command prompt

**List Tags Flow:**
1. User enters: `tag list`
2. System collects all unique tags across tasks
3. System counts usage for each tag
4. System sorts tags alphabetically
5. Display: "Available tags:"
6. For each tag: "- {tag} ({count} tasks)"
7. Return to command prompt

---

### Flow 11: Update Task with Multiple Properties

**Trigger:** User enters `update` command with multiple options

**Steps:**
1. User enters: `update 1 --priority low --tags work --due 2025-02-01`
2. System validates task ID exists
3. System shows current task details
4. System validates each update option
5. IF all valid:
   - System updates priority to low
   - System replaces tags with [work]
   - System sets dueDate to 2025-02-01
   - Display: "✓ Task #1 updated successfully."
   - Display: "[Priority: low] [Tags: work] [Due: 2025-02-01]"
6. IF any validation fails:
   - Display error, no changes applied
7. Return to command prompt

**Update Behavior:**
- Only specified properties are changed
- Unspecified properties remain unchanged
- `--tags` replaces entire tag list (use `tag add` to append)
- `--due none` removes due date

---

## Error Handling

### Input Validation Errors (Extended from Phase I)

| Error Condition | Error Message | Error Code |
|----------------|---------------|------------|
| Invalid priority | "Error: Priority must be high, medium, or low." | ERR_INVALID_PRIORITY |
| Invalid tag format | "Error: Tag '{tag}' is invalid. Tags must be 1-20 alphanumeric characters." | ERR_INVALID_TAG |
| Tag too long | "Error: Tag '{tag}' exceeds maximum length of 20 characters." | ERR_TAG_TOO_LONG |
| Invalid date format | "Error: Date must be in YYYY-MM-DD format." | ERR_INVALID_DATE |
| Invalid date value | "Error: '{date}' is not a valid calendar date." | ERR_INVALID_DATE_VALUE |
| Empty search keyword | "Error: Search keyword cannot be empty." | ERR_EMPTY_SEARCH |
| Invalid filter option | "Error: Invalid filter option '{option}'. Use --status, --priority, or --tag." | ERR_INVALID_FILTER |
| Invalid sort criterion | "Error: Invalid sort criterion '{criterion}'. Use: priority, due-date, name, or created." | ERR_INVALID_SORT |
| No filter to clear | "Warning: No active filters to clear." | WARN_NO_FILTER |

### Phase I Errors (Unchanged)
All Phase I error codes and messages remain unchanged (ERR_EMPTY_DESC, ERR_DESC_TOO_LONG, ERR_WHITESPACE_DESC, ERR_INVALID_ID, ERR_TASK_NOT_FOUND, ERR_UNKNOWN_CMD, ERR_MISSING_ARG).

---

## Acceptance Criteria

### AC-1: Basic Functionality (Phase II Extensions)
- [ ] User can add task with priority
- [ ] User can add task with tags
- [ ] User can add task with due date
- [ ] User can update task priority
- [ ] User can add tags to existing task
- [ ] User can remove tags from existing task
- [ ] User can set due date on existing task
- [ ] User can remove due date from task
- [ ] User can search tasks by keyword
- [ ] User can filter tasks by status
- [ ] User can filter tasks by priority
- [ ] User can filter tasks by tag
- [ ] User can combine multiple filters
- [ ] User can clear all filters
- [ ] User can sort tasks by priority
- [ ] User can sort tasks by due date
- [ ] User can sort tasks by name
- [ ] User can reset sort to default

### AC-2: Data Integrity (Phase II)
- [ ] Priority restricted to high/medium/low
- [ ] Tags validated and normalized to lowercase
- [ ] Duplicate tags prevented within task
- [ ] Invalid tag characters rejected
- [ ] Due dates validated as real calendar dates
- [ ] Past due dates accepted (for overdue tracking)
- [ ] Null due dates handled correctly

### AC-3: Display Requirements
- [ ] Priority displayed with visual indicators (!!!)
- [ ] Tags displayed with # prefix
- [ ] Due dates displayed in YYYY-MM-DD format
- [ ] Overdue tasks marked with "OVERDUE" indicator
- [ ] Active filters shown in status line
- [ ] Active sort shown in status line
- [ ] Search results highlight matched terms
- [ ] Compact list mode available

### AC-4: Backward Compatibility
- [ ] All Phase I commands work identically
- [ ] Phase I tasks auto-migrate with defaults (priority=medium, tags=[], dueDate=null)
- [ ] Phase I test suite passes against Phase II
- [ ] Adding task without options behaves like Phase I

### AC-5: Search Functionality
- [ ] Search finds tasks by description substring
- [ ] Search finds tasks by exact tag match
- [ ] Search is case-insensitive
- [ ] Empty search results show helpful message
- [ ] Search results sorted by relevance

### AC-6: Filter Functionality
- [ ] Status filter (complete/incomplete/all) works
- [ ] Priority filter (high/medium/low/any) works
- [ ] Tag filter (single or multiple tags) works
- [ ] Multiple filters combine with AND logic
- [ ] Filter state persists across commands
- [ ] Filter affects list, search, and sort results
- [ ] Filter clear removes all filters

### AC-7: Sort Functionality
- [ ] Sort by priority: high → medium → low
- [ ] Sort by due date: earliest → latest (null last)
- [ ] Sort by name: alphabetical A → Z
- [ ] Sort by created: oldest → newest (default)
- [ ] Sort state persists across commands
- [ ] Sort reset returns to creation order

### AC-8: Tag Management
- [ ] Can add multiple tags at once
- [ ] Can remove multiple tags at once
- [ ] Duplicate tags ignored
- [ ] Tag list shows all tags with counts
- [ ] Tags sorted alphabetically in tag list
- [ ] Removing non-existent tag doesn't error

### AC-9: Input Validation (Phase II)
- [ ] Invalid priority values rejected
- [ ] Invalid tag formats rejected
- [ ] Tags over 20 characters rejected
- [ ] Invalid date formats rejected
- [ ] Invalid date values rejected (e.g., 2025-13-01)
- [ ] Empty search keywords rejected

### AC-10: Code Quality (Updated)
- [ ] All code written in TypeScript strict mode
- [ ] Zero TypeScript compilation errors
- [ ] Zero TypeScript compilation warnings
- [ ] Zero ESLint errors
- [ ] All new functions have explicit return types
- [ ] Extended Task interface matches specification

### AC-11: Testing (Updated)
- [ ] Unit tests for priority validation
- [ ] Unit tests for tag validation
- [ ] Unit tests for date validation
- [ ] Unit tests for search functionality
- [ ] Unit tests for filter logic
- [ ] Unit tests for sort logic
- [ ] Tests for backward compatibility
- [ ] Overall test coverage ≥80%
- [ ] All tests pass

### AC-12: Documentation (Updated)
- [ ] README.md updated with Phase II features
- [ ] README.md includes examples of new commands
- [ ] CHANGELOG.md updated with Phase II changes
- [ ] All new public functions have JSDoc comments

### AC-13: Performance (Phase II)
- [ ] Search completes in <200ms for 10,000 tasks
- [ ] Filter applies in <100ms for 10,000 tasks
- [ ] Sort completes in <150ms for 10,000 tasks
- [ ] No memory leaks with large tag sets

---

## Migration from Phase I

### Automatic Migration
When Phase II starts with Phase I data:
1. All existing tasks gain `priority: 'medium'`
2. All existing tasks gain `tags: []`
3. All existing tasks gain `dueDate: null`
4. No user action required
5. Data remains in-memory (no persistence yet)

### Manual Migration (Future)
Phase II does not include persistent storage, so migration is automatic on each startup. Future phases with persistence will need explicit migration logic.

---

## Implementation Notes

### Suggested Module Structure (Updated)
```
src/
  ├── models/
  │   └── task.ts              // Extended Task interface with Phase II fields
  ├── services/
  │   ├── taskService.ts       // Extended with priority, tags, due date
  │   ├── searchService.ts     // NEW: Search logic
  │   ├── filterService.ts     // NEW: Filter logic
  │   └── sortService.ts       // NEW: Sort logic
  ├── ui/
  │   └── cli.ts               // Extended with new commands
  ├── utils/
  │   ├── validators.ts        // Extended with tag, priority, date validation
  │   ├── formatters.ts        // NEW: Display formatting utilities
  │   └── dateUtils.ts         // NEW: Date parsing and comparison
  └── index.ts                 // Application entry point (unchanged)
```

### Testing Strategy (Phase II)
- Unit test all new validation functions
- Unit test search algorithm with edge cases
- Unit test filter combinations
- Unit test all sort criteria
- Integration test backward compatibility
- Test tag normalization and deduplication
- Test date parsing edge cases

### Display Formatting Rules

**Priority Indicators:**
- High: `[!!!]` (red in color terminals)
- Medium: `[!!]` (yellow in color terminals)
- Low: `[!]` (green in color terminals)

**Tag Display:**
- Prefix with `#` symbol
- Comma-separated: `#work #urgent`
- Max 5 tags shown in list (+ count if more)

**Due Date Display:**
- Format: `[Due: YYYY-MM-DD]`
- If overdue: `[Due: YYYY-MM-DD OVERDUE]` (red)
- If due today: `[Due: YYYY-MM-DD TODAY]` (yellow)
- If due tomorrow: `[Due: YYYY-MM-DD TOMORROW]` (yellow)

**Status Line (New):**
```
[Filters: status=incomplete, priority=high] [Sort: priority] [5 tasks shown]
```

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0.0 | 2025-12-31 | Human Architect | Phase II specification with organization features |

---

## Approval

**Specification Status:** Ready for Implementation

**Next Steps:**
1. Human reviews and approves specification
2. Hand off to Claude Code for implementation
3. Claude Code implements according to this specification
4. Human reviews implementation against acceptance criteria
5. Human approves or requests revisions

---

## Dependencies on Phase I

**Required Phase I Components:**
- All Phase I data models
- All Phase I business logic
- All Phase I validation rules
- All Phase I CLI commands
- All Phase I test coverage

**Phase I Components to Extend:**
- Task interface (add fields)
- TaskService (add methods)
- CLI (add commands)
- Validators (add functions)

**Phase I Components Unchanged:**
- Error handling patterns
- Command prompt behavior
- Input/output formatting base structure
- Test infrastructure

---

**Document Owner:** Human Architect
**Implementation Owner:** Claude Code (when approved)
**Governed By:** CONSTITUTION.md v1.0.0
**Extends:** SPEC-PHASE-I.md v1.0.0
