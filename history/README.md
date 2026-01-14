# History Logs

This folder contains comprehensive historical records of user actions and AI chatbot interactions.

## Structure

- `users/` - User action logs (login, logout, task operations)
- `chatbot/` - AI chatbot conversation logs

## Format

All logs are stored as JSON files with timestamps and are append-only to preserve complete history.

## User Action Logs

Location: `history/users/{userId}.json`

Each user has their own log file containing:
- Authentication events (login, logout)
- Task operations (create, update, delete, complete)
- Timestamps and metadata

## Chatbot Logs

Location: `history/chatbot/{userId}-conversations.json`

Stores all chatbot interactions per user including:
- User messages
- AI responses
- Task operations performed
- Timestamps
