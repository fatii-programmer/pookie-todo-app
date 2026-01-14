# Evolution of Todo - Phase III Specification

**Version:** 3.0.0
**Date:** 2025-12-31
**Status:** Ready for Implementation
**Governed By:** CONSTITUTION.md v1.0.0

---

## Table of Contents
1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Visual Design System](#visual-design-system)
4. [Application Architecture](#application-architecture)
5. [Pages & Layouts](#pages--layouts)
6. [UI Components](#ui-components)
7. [AI Natural Language Processing](#ai-natural-language-processing)
8. [Animations & Transitions](#animations--transitions)
9. [Responsive Behavior](#responsive-behavior)
10. [User Flows](#user-flows)
11. [Acceptance Criteria](#acceptance-criteria)

---

## Overview

### Purpose
Phase III transforms the Evolution of Todo from a console application into a delightful, AI-powered web application featuring a "pookie-style" pastel aesthetic with natural language task management through an integrated chatbot interface.

### Scope
This specification defines:
- Complete web UI/UX transformation
- User authentication system
- AI-powered natural language task management
- Cute, pastel visual design system
- Responsive multi-device support
- Real-time chatbot interaction
- Enhanced task management features

### Key Features
1. **User Authentication** - Login/signup with session management
2. **Todo Dashboard** - Visual task management with priority, categories, and scheduling
3. **AI Chatbot Panel** - Natural language task operations
4. **Pookie Aesthetic** - Soft pastels, rounded corners, gentle animations
5. **Smart Scheduling** - Date/time recognition and task organization
6. **Priority System** - Visual priority badges and filtering
7. **Category Management** - Organize tasks by context

### Out of Scope (Phase IV+)
- Team collaboration / shared lists
- Mobile native apps
- Calendar integrations
- Email notifications
- Third-party API integrations
- Voice input
- Offline mode

---

## Design Philosophy

### Visual Philosophy: "Pookie Style"

**Core Aesthetic Principles:**
1. **Soft & Approachable** - Everything feels gentle, never harsh or corporate
2. **Pastel Palette** - Muted, desaturated colors that are easy on the eyes
3. **Rounded Everything** - No sharp corners, generous border radii
4. **Gentle Motion** - Smooth, bouncy animations that feel alive
5. **Cute Details** - Playful micro-interactions and delightful surprises
6. **Spacious Layout** - Generous padding and breathing room

**Design Language:**
- Think: cozy digital planner meets gentle productivity buddy
- Vibe: supportive friend, not demanding taskmaster
- Feel: warm, comfortable, encouraging

---

## Visual Design System

### Color Palette

#### Primary Colors
```css
--pookie-lavender: #E6D9F5        /* Primary brand color */
--pookie-lavender-light: #F3ECFC  /* Hover states */
--pookie-lavender-dark: #D4C4EA   /* Active states */
```

#### Accent Colors
```css
--pookie-mint: #D5F5E8            /* Success, completed tasks */
--pookie-peach: #FFE5D9           /* Important/urgent */
--pookie-sky: #D9EBFF             /* Info, links */
--pookie-rose: #FFD9E8            /* Delete, warnings */
--pookie-lemon: #FFF9D9           /* Medium priority */
```

#### Neutral Colors
```css
--pookie-white: #FEFEFE           /* Primary background */
--pookie-cream: #FAF8F5           /* Card backgrounds */
--pookie-gray-light: #F0EEF0      /* Borders */
--pookie-gray-mid: #C8C5CC        /* Disabled states */
--pookie-gray-dark: #8B8793       /* Secondary text */
--pookie-charcoal: #4A4555        /* Primary text */
```

#### Semantic Colors
```css
/* Priority Colors */
--priority-critical: var(--pookie-peach)    /* High priority */
--priority-high: var(--pookie-lemon)        /* Medium priority */
--priority-normal: var(--pookie-sky)        /* Normal priority */
--priority-low: var(--pookie-mint)          /* Low priority */

/* Status Colors */
--status-complete: var(--pookie-mint)
--status-pending: var(--pookie-sky)
--status-overdue: var(--pookie-rose)
```

### Typography

#### Font Families
```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
--font-display: 'Quicksand', 'Inter', sans-serif  /* Headings */
--font-mono: 'JetBrains Mono', 'Consolas', monospace  /* Code/timestamps */
```

#### Type Scale
```css
--text-xs: 0.75rem      /* 12px - Timestamps, labels */
--text-sm: 0.875rem     /* 14px - Body small, helper text */
--text-base: 1rem       /* 16px - Body text */
--text-lg: 1.125rem     /* 18px - Subheadings */
--text-xl: 1.25rem      /* 20px - Card titles */
--text-2xl: 1.5rem      /* 24px - Section headers */
--text-3xl: 1.875rem    /* 30px - Page titles */
--text-4xl: 2.25rem     /* 36px - Hero text */
```

#### Font Weights
```css
--weight-normal: 400
--weight-medium: 500
--weight-semibold: 600
--weight-bold: 700
```

### Spacing System

**Base Unit:** 4px (0.25rem)

```css
--space-1: 4px     /* 0.25rem */
--space-2: 8px     /* 0.5rem */
--space-3: 12px    /* 0.75rem */
--space-4: 16px    /* 1rem */
--space-5: 20px    /* 1.25rem */
--space-6: 24px    /* 1.5rem */
--space-8: 32px    /* 2rem */
--space-10: 40px   /* 2.5rem */
--space-12: 48px   /* 3rem */
--space-16: 64px   /* 4rem */
--space-20: 80px   /* 5rem */
```

### Border Radius System

```css
--radius-sm: 8px      /* Small elements (badges, tags) */
--radius-md: 12px     /* Buttons, inputs */
--radius-lg: 16px     /* Cards, panels */
--radius-xl: 24px     /* Large cards, modals */
--radius-full: 9999px /* Pills, circular elements */
```

### Shadows

```css
--shadow-sm: 0 2px 4px rgba(74, 69, 85, 0.04),
             0 1px 2px rgba(74, 69, 85, 0.02)

--shadow-md: 0 4px 8px rgba(74, 69, 85, 0.06),
             0 2px 4px rgba(74, 69, 85, 0.03)

--shadow-lg: 0 8px 16px rgba(74, 69, 85, 0.08),
             0 4px 8px rgba(74, 69, 85, 0.04)

--shadow-xl: 0 16px 32px rgba(74, 69, 85, 0.1),
             0 8px 16px rgba(74, 69, 85, 0.05)

--shadow-inner: inset 0 2px 4px rgba(74, 69, 85, 0.06)
```

---

## Application Architecture

### Technology Stack

#### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **State Management:** Zustand or Jotai (lightweight, modern)
- **Routing:** React Router v6
- **Styling:** CSS Modules or Tailwind CSS (configured for pookie palette)
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Date/Time:** date-fns
- **HTTP Client:** Axios or Fetch API

#### Backend
- **Runtime:** Node.js (LTS)
- **Framework:** Express.js or Fastify
- **Language:** TypeScript
- **Database:** PostgreSQL or SQLite (with Prisma ORM)
- **Authentication:** JWT tokens + httpOnly cookies
- **Session Storage:** Redis or in-memory (Phase III)
- **AI/NLP:** OpenAI API (GPT-4) or Claude API for natural language processing

#### Development Tools
- **Testing:** Vitest + React Testing Library
- **E2E Testing:** Playwright
- **Linting:** ESLint + Prettier
- **Type Checking:** TypeScript strict mode

### Application Structure

```
Frontend (React SPA)
├── Public Routes
│   └── /login - Authentication page
│
└── Protected Routes (requires authentication)
    ├── /dashboard - Main todo dashboard
    ├── /settings - User settings (Phase IV)
    └── /profile - User profile (Phase IV)

Backend API
├── /api/auth
│   ├── POST /signup - User registration
│   ├── POST /login - User authentication
│   └── POST /logout - Session termination
│
├── /api/todos
│   ├── GET / - List all todos
│   ├── POST / - Create todo
│   ├── PATCH /:id - Update todo
│   └── DELETE /:id - Delete todo
│
└── /api/ai
    └── POST /chat - Natural language processing endpoint
```

---

## Pages & Layouts

### Page 1: Login Page

**Route:** `/login`
**Access:** Public

#### Layout Structure

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              [App Logo/Wordmark]                │
│                                                 │
│         ┌───────────────────────────┐          │
│         │                           │          │
│         │   Welcome to Pookie Todo  │          │
│         │   ~~~~~~~~~~~~~~~~~~~~    │          │
│         │                           │          │
│         │   [Email Input]           │          │
│         │   [Password Input]        │          │
│         │                           │          │
│         │   [Login Button]          │          │
│         │                           │          │
│         │   Don't have an account?  │          │
│         │   [Sign Up Link]          │          │
│         │                           │          │
│         └───────────────────────────┘          │
│                                                 │
│         Made with ♡ by Pookie Tech             │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### Visual Specifications

**Container:**
- Center-aligned on viewport
- Max width: 420px
- Background: `--pookie-cream`
- Border radius: `--radius-xl` (24px)
- Padding: `--space-10` (40px)
- Shadow: `--shadow-lg`

**Logo/Wordmark:**
- Position: Top center, above card
- Font: `--font-display`
- Size: `--text-4xl` (36px)
- Color: `--pookie-lavender-dark`
- Margin bottom: `--space-8`

**Heading:**
- Text: "Welcome to Pookie Todo" or "Welcome back, pookie ♡"
- Font: `--font-display`
- Size: `--text-2xl` (24px)
- Weight: `--weight-semibold`
- Color: `--pookie-charcoal`
- Text align: center
- Decorative underline: wavy line in `--pookie-lavender-light`

**Input Fields:**
- Width: 100%
- Height: 48px
- Background: `--pookie-white`
- Border: 1px solid `--pookie-gray-light`
- Border radius: `--radius-md` (12px)
- Padding: `--space-4` horizontal
- Font size: `--text-base`
- Spacing between inputs: `--space-4`

**Focus State:**
- Border color: `--pookie-lavender`
- Box shadow: `0 0 0 3px rgba(230, 217, 245, 0.3)`
- Transition: all 0.2s ease

**Login Button:**
- Width: 100%
- Height: 48px
- Background: `--pookie-lavender`
- Color: `--pookie-charcoal`
- Border: none
- Border radius: `--radius-md`
- Font weight: `--weight-semibold`
- Cursor: pointer
- Transition: all 0.2s ease

**Button Hover:**
- Background: `--pookie-lavender-light`
- Transform: translateY(-1px)
- Shadow: `--shadow-md`

**Button Active:**
- Background: `--pookie-lavender-dark`
- Transform: translateY(0)

**Sign Up Link:**
- Color: `--pookie-lavender-dark`
- Text decoration: none
- Font size: `--text-sm`
- Hover: underline

#### Authentication States

**Loading State:**
- Button shows loading spinner
- Button text: "Logging in..."
- Button disabled
- Inputs disabled

**Error State:**
- Error message appears above button
- Background: `--pookie-rose` with 10% opacity
- Border radius: `--radius-sm`
- Padding: `--space-3`
- Color: Red-tinted `--pookie-charcoal`
- Icon: small ⚠️ emoji

**Success State:**
- Button background: `--pookie-mint`
- Button text: "Welcome! ♡"
- Brief 0.5s display before redirect

#### Validation Rules

**Email:**
- Required
- Valid email format
- Max length: 254 characters
- Error: "Please enter a valid email address"

**Password:**
- Required
- Min length: 8 characters
- Error: "Password must be at least 8 characters"

---

### Page 2: Todo Dashboard

**Route:** `/dashboard`
**Access:** Protected (requires authentication)

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Header: Logo | Search | Profile Avatar]                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────┐  ┌────────────────────────────────┐ │
│  │                          │  │                                │ │
│  │   MAIN TODO PANEL        │  │   AI CHATBOT PANEL             │ │
│  │                          │  │                                │ │
│  │   [Quick Add Bar]        │  │   [Chat Message History]       │ │
│  │                          │  │   - AI Message                 │ │
│  │   [Filter Tabs]          │  │   - User Message               │ │
│  │   • All                  │  │   - AI Message                 │ │
│  │   • Today                │  │                                │ │
│  │   • Upcoming             │  │   [Chat Input Bar]             │ │
│  │   • Completed            │  │                                │ │
│  │                          │  └────────────────────────────────┘ │
│  │   [Todo Cards]           │                                      │
│  │   ┌────────────────────┐ │                                      │
│  │   │ □ Task Title       │ │                                      │
│  │   │ [!] Due: Tomorrow  │ │                                      │
│  │   │ #work              │ │                                      │
│  │   └────────────────────┘ │                                      │
│  │                          │                                      │
│  │   ┌────────────────────┐ │                                      │
│  │   │ ☑ Completed Task   │ │                                      │
│  │   │ #personal          │ │                                      │
│  │   └────────────────────┘ │                                      │
│  │                          │                                      │
│  └──────────────────────────┘                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### Responsive Layout Breakpoints

**Desktop (≥1024px):**
- Two-column layout
- Main panel: 60% width
- Chatbot panel: 40% width
- Chatbot panel sticky/fixed

**Tablet (768px - 1023px):**
- Single column layout
- Chatbot panel becomes bottom sheet (collapsible)
- Floating action button to toggle chatbot

**Mobile (< 768px):**
- Single column, full width
- Chatbot panel as full-screen modal or bottom drawer
- Sticky floating chat button in bottom-right

#### Header Component

**Layout:**
- Height: 64px
- Background: `--pookie-white`
- Border bottom: 1px solid `--pookie-gray-light`
- Padding: `--space-4` horizontal
- Display: flex, space-between, align-center

**Logo (Left):**
- Font: `--font-display`
- Size: `--text-xl`
- Color: `--pookie-lavender-dark`
- Text: "pookie" or "♡ pookie todo"

**Search Bar (Center - Desktop only):**
- Width: 400px max
- Height: 40px
- Background: `--pookie-cream`
- Border radius: `--radius-full`
- Placeholder: "Search tasks..."
- Icon: magnifying glass (left)

**Profile Section (Right):**
- Display: flex, align-center, gap `--space-3`
- Notifications icon (future)
- User avatar: 40px circle, `--pookie-lavender` background
- Dropdown menu on click

---

### Main Todo Panel

#### Quick Add Bar

**Visual Design:**
- Position: Top of todo panel
- Background: `--pookie-lavender-light`
- Border radius: `--radius-lg`
- Padding: `--space-4`
- Shadow: `--shadow-sm`
- Margin bottom: `--space-6`

**Layout:**
```
┌────────────────────────────────────────────┐
│  [+] Add a new task...                [↵] │
└────────────────────────────────────────────┘
```

**Input Field:**
- Background: `--pookie-white`
- Border: none
- Border radius: `--radius-md`
- Height: 48px
- Padding: `--space-4`
- Font size: `--text-base`
- Placeholder: "Add a new task... ♡"

**Add Button:**
- Size: 36px circle
- Background: `--pookie-lavender`
- Border radius: `--radius-full`
- Icon: plus or enter arrow
- Position: absolute right

**Interaction:**
- Click input to expand (if collapsed)
- Press Enter or click button to add
- Auto-focus on page load
- Supports natural language: "Buy milk tomorrow at 5pm #groceries !high"

#### Filter Tabs

**Visual Design:**
- Display: flex, gap `--space-2`
- Margin bottom: `--space-6`

**Tab Button:**
- Background: transparent
- Border: 1px solid `--pookie-gray-light`
- Border radius: `--radius-full`
- Padding: `--space-2` `--space-4`
- Font size: `--text-sm`
- Color: `--pookie-gray-dark`
- Transition: all 0.2s ease

**Active Tab:**
- Background: `--pookie-lavender`
- Border color: `--pookie-lavender`
- Color: `--pookie-charcoal`
- Font weight: `--weight-semibold`

**Tab Options:**
1. **All** - Shows all incomplete tasks
2. **Today** - Tasks due today
3. **Upcoming** - Tasks due in next 7 days
4. **Completed** - Completed tasks (strikethrough)

#### Todo Cards List

**Container:**
- Display: flex column
- Gap: `--space-3`
- Max height: calc(100vh - 300px)
- Overflow-y: auto
- Padding right: `--space-2` (scrollbar spacing)

**Empty State:**
- Center-aligned content
- Illustration or emoji: ✨🌸
- Text: "No tasks yet, pookie! Add one to get started ♡"
- Font size: `--text-lg`
- Color: `--pookie-gray-mid`

---

### AI Chatbot Panel

**Visual Design:**
- Background: `--pookie-cream`
- Border left: 1px solid `--pookie-gray-light` (desktop)
- Height: calc(100vh - 64px) on desktop
- Position: sticky, top: 64px

#### Panel Header

```
┌────────────────────────────┐
│  ✨ Your Todo Assistant    │
│  [Minimize] [Settings]     │
└────────────────────────────┘
```

**Specifications:**
- Height: 56px
- Background: `--pookie-lavender-light`
- Padding: `--space-4`
- Border bottom: 1px solid `--pookie-gray-light`

**Title:**
- Font: `--font-display`
- Size: `--text-lg`
- Weight: `--weight-semibold`
- Icon: sparkles emoji ✨

#### Chat Message Area

**Container:**
- Height: calc(100% - 56px header - 80px input)
- Overflow-y: auto
- Padding: `--space-4`
- Display: flex column, gap `--space-4`

**Auto-scroll:**
- Always scroll to bottom on new message
- Smooth scroll behavior

#### Initial Greeting

**Display on first visit:**
```
┌─────────────────────────────────────┐
│  ✨ AI Assistant                    │
│                                     │
│  Hi pookie! I'm here to help with  │
│  your tasks. Try saying:           │
│                                     │
│  • "Add buy milk tomorrow"         │
│  • "Mark task 3 as done"           │
│  • "Show my work tasks"            │
│  • "Move all work tasks to Monday" │
│                                     │
└─────────────────────────────────────┘
```

**Style:**
- Background: `--pookie-white`
- Border: 1px dashed `--pookie-lavender`
- Border radius: `--radius-lg`
- Padding: `--space-5`

#### Chat Input Bar

**Position:** Bottom of chatbot panel
**Height:** 80px
**Background:** `--pookie-white`
**Border top:** 1px solid `--pookie-gray-light`

```
┌────────────────────────────────────┐
│ [Type your message...]        [↑] │
│ AI is typing...                    │
└────────────────────────────────────┘
```

**Input Field:**
- Multi-line textarea (max 3 rows)
- Auto-expand as user types
- Padding: `--space-3`
- Border radius: `--radius-md`
- Background: `--pookie-cream`

**Send Button:**
- Size: 40px circle
- Background: `--pookie-lavender`
- Icon: up arrow or paper plane
- Disabled when input empty

**Typing Indicator:**
- Shows when AI is processing
- Animated dots: "●●●"
- Color: `--pookie-gray-mid`

---

## UI Components

### Component 1: Todo Card

**Purpose:** Display individual task with all metadata and actions

#### Visual Design

```
┌───────────────────────────────────────────────────┐
│  □  Fix the login bug                       [!]   │
│     📅 Due: Tomorrow, 3:00 PM                     │
│     #work  #urgent                                │
│     ─────────────────────────                     │
│     [Edit] [Delete]                               │
└───────────────────────────────────────────────────┘
```

**Container:**
- Background: `--pookie-white`
- Border: 1px solid `--pookie-gray-light`
- Border radius: `--radius-lg` (16px)
- Padding: `--space-4`
- Shadow: `--shadow-sm`
- Transition: all 0.2s ease

**Hover State:**
- Border color: `--pookie-lavender-light`
- Shadow: `--shadow-md`
- Transform: translateY(-2px)

#### Card Structure

**Row 1: Title & Checkbox & Priority**
- Display: flex, align-items-start
- Gap: `--space-3`

**Checkbox:**
- Size: 24px
- Border: 2px solid `--pookie-gray-mid`
- Border radius: `--radius-sm` (8px)
- Background: `--pookie-white`
- Cursor: pointer
- Transition: all 0.2s ease

**Checkbox Checked:**
- Background: `--pookie-mint`
- Border color: `--pookie-mint`
- Icon: checkmark (animated in)

**Title Text:**
- Flex: 1
- Font size: `--text-base`
- Font weight: `--weight-medium`
- Color: `--pookie-charcoal`
- Line height: 1.5

**Completed State:**
- Text decoration: line-through
- Opacity: 0.6
- Color: `--pookie-gray-dark`

**Priority Badge (Right):**
- Size: 28px circle or pill
- Position: absolute top-right
- See Priority Badge component below

**Row 2: Due Date/Time**
- Margin top: `--space-2`
- Margin left: 32px (aligned with title)
- Display: flex, align-items-center
- Gap: `--space-2`

**Due Date Display:**
- Icon: 📅 calendar emoji or icon
- Font size: `--text-sm`
- Color: `--pookie-gray-dark`
- Format: "Today, 3:00 PM" | "Tomorrow" | "Dec 31" | "Next Monday"

**Overdue State:**
- Color: Color from `--pookie-rose` palette
- Icon: ⚠️
- Font weight: `--weight-semibold`

**Row 3: Category Tags**
- Margin top: `--space-2`
- Margin left: 32px
- Display: flex, flex-wrap, gap `--space-2`

**Category Tag:**
- See Category Tag component below

**Row 4: Actions (Show on hover or always on mobile)**
- Margin top: `--space-3`
- Border top: 1px solid `--pookie-gray-light`
- Padding top: `--space-3`
- Display: flex, gap `--space-2`
- Opacity: 0 (visible on hover)
- Transition: opacity 0.2s

**Action Buttons:**
- Size: 32px
- Background: `--pookie-cream`
- Border: none
- Border radius: `--radius-sm`
- Icon size: 16px
- Cursor: pointer

**Button Hover:**
- Background: `--pookie-lavender-light`

---

### Component 2: Priority Badge

**Purpose:** Visual indicator for task priority level

#### Variants

**Critical Priority:**
- Background: `--pookie-peach`
- Icon: !! or ⚡
- Label: "High" or just icon
- Size: 28px circle or pill
- Border: 2px solid darker peach
- Animation: gentle pulse

**High Priority:**
- Background: `--pookie-lemon`
- Icon: !
- Label: "Medium"

**Normal Priority:**
- Background: `--pookie-sky`
- Icon: • or none
- Label: Not shown (default state)

**Low Priority:**
- Background: `--pookie-mint`
- Icon: ↓
- Label: "Low"

#### Specifications
- Border radius: `--radius-full` for circle, `--radius-sm` for pill
- Font size: `--text-xs`
- Font weight: `--weight-semibold`
- Padding (pill): `--space-1` `--space-3`
- Text color: Darker shade of background color

---

### Component 3: Category Tag

**Purpose:** Visual label for task categories/contexts

#### Visual Design

```
#work  #personal  #shopping  #fitness
```

**Specifications:**
- Background: `--pookie-lavender-light`
- Color: `--pookie-lavender-dark`
- Font size: `--text-xs`
- Font weight: `--weight-medium`
- Padding: `--space-1` `--space-3`
- Border radius: `--radius-full`
- Border: 1px solid `--pookie-lavender`
- Display: inline-flex
- Align items: center
- Gap: `--space-1`

**Icon (optional):**
- Size: 12px
- Emoji or icon representing category

**Hover State:**
- Background: `--pookie-lavender`
- Cursor: pointer (if clickable for filtering)
- Transform: scale(1.05)

**Predefined Categories with Colors:**
- `#work` - `--pookie-sky` background
- `#personal` - `--pookie-lavender` background
- `#shopping` - `--pookie-lemon` background
- `#fitness` - `--pookie-mint` background
- `#urgent` - `--pookie-peach` background
- Custom tags - `--pookie-gray-light` background

---

### Component 4: Cute Toggle Button

**Purpose:** Switch between states (e.g., light/dark mode, view modes)

#### Visual Design

```
┌─────────────┐
│  ○─────────  │  (Off state)
└─────────────┘

┌─────────────┐
│  ─────────●  │  (On state)
└─────────────┘
```

**Container:**
- Width: 52px
- Height: 28px
- Background (off): `--pookie-gray-light`
- Background (on): `--pookie-lavender`
- Border radius: `--radius-full`
- Border: 2px solid transparent
- Cursor: pointer
- Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

**Toggle Circle:**
- Size: 24px
- Background: `--pookie-white`
- Border radius: `--radius-full`
- Position: absolute
- Left: 2px (off), calc(100% - 26px) (on)
- Shadow: `--shadow-sm`
- Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

**Animation:**
- Circle bounces slightly when toggled
- Background color smoothly transitions
- Optional: small sparkle effect ✨ on toggle

**Hover State:**
- Scale: 1.05
- Shadow: `--shadow-md`

**Focus State:**
- Outline: 2px solid `--pookie-lavender`
- Outline offset: 2px

---

### Component 5: Chat Bubble

**Purpose:** Display messages in AI chatbot conversation

#### User Message Bubble

```
                        ┌────────────────────┐
                        │  Mark task 3 done  │
                        │  10:45 AM          │
                        └────────────────────┘
```

**Specifications:**
- Background: `--pookie-lavender`
- Color: `--pookie-charcoal`
- Border radius: `--radius-lg` `--radius-lg` `--radius-sm` `--radius-lg` (rounded except bottom-right)
- Padding: `--space-3` `--space-4`
- Max width: 80%
- Align: flex-end (right side)
- Shadow: `--shadow-sm`
- Margin bottom: `--space-3`

**Timestamp:**
- Font size: `--text-xs`
- Color: `--pookie-gray-dark`
- Margin top: `--space-1`
- Text align: right

#### AI Message Bubble

```
┌─────────────────────────────────┐
│  ✨ AI Assistant                │
│                                 │
│  Sure! I've marked task #3      │
│  "Buy groceries" as complete ♡  │
│                                 │
│  Anything else?                 │
│  10:45 AM                       │
└─────────────────────────────────┘
```

**Specifications:**
- Background: `--pookie-white`
- Color: `--pookie-charcoal`
- Border: 1px solid `--pookie-gray-light`
- Border radius: `--radius-lg` `--radius-lg` `--radius-lg` `--radius-sm` (rounded except bottom-left)
- Padding: `--space-3` `--space-4`
- Max width: 85%
- Align: flex-start (left side)
- Shadow: `--shadow-sm`
- Margin bottom: `--space-3`

**Avatar:**
- Size: 32px circle
- Background: `--pookie-mint`
- Icon: ✨ sparkle or AI symbol
- Position: absolute left, top
- Margin right: `--space-2`

**Typing Indicator (while AI is generating):**
```
┌────────────┐
│  ●●●       │  (animated)
└────────────┘
```

**Specifications:**
- Three dots: 8px circles
- Color: `--pookie-gray-mid`
- Animation: bounce sequentially
- Duration: 1.2s infinite

---

### Component 6: Button System

#### Primary Button

**Visual:**
- Background: `--pookie-lavender`
- Color: `--pookie-charcoal`
- Border: none
- Border radius: `--radius-md` (12px)
- Padding: `--space-3` `--space-6`
- Font size: `--text-base`
- Font weight: `--weight-semibold`
- Height: 44px (minimum touch target)
- Cursor: pointer
- Transition: all 0.2s ease

**Hover:**
- Background: `--pookie-lavender-light`
- Transform: translateY(-2px)
- Shadow: `--shadow-md`

**Active:**
- Transform: translateY(0)
- Shadow: `--shadow-sm`

**Disabled:**
- Background: `--pookie-gray-light`
- Color: `--pookie-gray-mid`
- Cursor: not-allowed
- Opacity: 0.6

#### Secondary Button

**Visual:**
- Background: transparent
- Color: `--pookie-lavender-dark`
- Border: 1px solid `--pookie-lavender`
- Other properties same as primary

**Hover:**
- Background: `--pookie-lavender-light`
- Border color: `--pookie-lavender-dark`

#### Ghost Button

**Visual:**
- Background: transparent
- Color: `--pookie-gray-dark`
- Border: none
- Hover background: `--pookie-cream`

#### Icon Button

**Visual:**
- Size: 40px × 40px
- Border radius: `--radius-md` or `--radius-full`
- Background: `--pookie-cream`
- Icon size: 20px
- Padding: `--space-2`

**Hover:**
- Background: `--pookie-lavender-light`
- Rotate: 5deg (subtle playful tilt)

---

### Component 7: Input Field

**Visual Design:**
- Background: `--pookie-white`
- Border: 1px solid `--pookie-gray-light`
- Border radius: `--radius-md` (12px)
- Height: 44px
- Padding: `--space-3` `--space-4`
- Font size: `--text-base`
- Color: `--pookie-charcoal`
- Transition: all 0.2s ease

**Label (Floating or Top):**
- Font size: `--text-sm`
- Color: `--pookie-gray-dark`
- Font weight: `--weight-medium`
- Margin bottom: `--space-2`

**Placeholder:**
- Color: `--pookie-gray-mid`
- Font style: normal

**Focus State:**
- Border color: `--pookie-lavender`
- Outline: none
- Box shadow: `0 0 0 3px rgba(230, 217, 245, 0.3)`

**Error State:**
- Border color: Red shade
- Background: `--pookie-rose` with 5% opacity

**Error Message:**
- Font size: `--text-xs`
- Color: Red shade
- Margin top: `--space-1`
- Icon: ⚠️

**Success State:**
- Border color: Green shade
- Icon: ✓ checkmark (right side)

---

### Component 8: Modal/Dialog

**Purpose:** Overlay for confirmations, task editing, settings

#### Structure

```
      [Background Overlay - Semi-transparent]

      ┌────────────────────────────────┐
      │  [X]                           │
      │                                │
      │  Edit Task                     │
      │  ────────                      │
      │                                │
      │  [Task Title Input]            │
      │  [Due Date Picker]             │
      │  [Priority Selector]           │
      │  [Category Input]              │
      │                                │
      │  [Cancel]  [Save Changes]      │
      │                                │
      └────────────────────────────────┘
```

**Overlay:**
- Background: `rgba(74, 69, 85, 0.4)` (charcoal with 40% opacity)
- Backdrop blur: 4px
- Z-index: 1000

**Modal Container:**
- Background: `--pookie-cream`
- Border radius: `--radius-xl` (24px)
- Padding: `--space-8`
- Max width: 500px
- Shadow: `--shadow-xl`
- Position: center of viewport
- Animation: slide-in from bottom + fade-in

**Close Button:**
- Position: absolute top-right
- Size: 40px
- Icon: × (close symbol)
- Color: `--pookie-gray-dark`
- Hover: color `--pookie-charcoal`, rotate 90deg

**Modal Header:**
- Font: `--font-display`
- Size: `--text-2xl`
- Weight: `--weight-semibold`
- Margin bottom: `--space-6`
- Border bottom: 2px solid `--pookie-gray-light`
- Padding bottom: `--space-4`

**Modal Footer:**
- Display: flex, justify-content: flex-end
- Gap: `--space-3`
- Margin top: `--space-6`
- Border top: 1px solid `--pookie-gray-light`
- Padding top: `--space-4`

---

## Animations & Transitions

### Animation Principles

1. **Purposeful Motion** - Every animation serves a function
2. **Smooth & Natural** - Use easing curves that feel organic
3. **Subtle & Gentle** - Never jarring or aggressive
4. **Performant** - Use transform and opacity for GPU acceleration
5. **Delightful Details** - Small touches that bring joy

### Global Transitions

```css
/* Default transition */
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Smooth transition */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Bouncy transition */
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Specific Animations

#### 1. Page Load Animation

**Dashboard loads with stagger effect:**
- Header: fade-in from top (100ms delay)
- Todo panel: slide-in from left (200ms delay)
- Chatbot panel: slide-in from right (300ms delay)
- Todo cards: stagger fade-in, 50ms between each

**Keyframes:**
```css
@keyframes fadeInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

#### 2. Todo Card Interactions

**On Hover:**
- Transform: translateY(-2px)
- Shadow increases
- Duration: 0.2s

**On Checkbox Click:**
- Checkbox: scale bounce (0.8 → 1.1 → 1)
- Checkmark: draw-in animation
- Card: if completed, fade opacity and slide slightly left
- Duration: 0.4s with bounce easing

**On Add (new card):**
- Fade in + scale from 0.95 to 1
- Slight bounce
- Duration: 0.3s

**On Delete:**
- Scale to 0.9
- Fade out opacity
- Slide left -100px
- Height collapse
- Duration: 0.3s

#### 3. Chat Message Animations

**User message sent:**
- Slide in from right + fade in
- Slight bounce on land
- Duration: 0.3s

**AI response:**
- Fade in (wait for typing indicator)
- Slide in from left
- Text appears with typewriter effect (optional)
- Duration: 0.4s

**Typing indicator:**
- Three dots bounce sequentially
- Infinite loop
- Each dot: 0.4s bounce cycle, 0.1s delay between

```css
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}

.dot-1 { animation: bounce 1.2s infinite; }
.dot-2 { animation: bounce 1.2s 0.2s infinite; }
.dot-3 { animation: bounce 1.2s 0.4s infinite; }
```

#### 4. Button Animations

**On Hover:**
- Transform: translateY(-2px)
- Shadow: increase
- Duration: 0.2s

**On Click:**
- Transform: scale(0.95)
- Duration: 0.1s
- Return: bounce back to normal

**Loading State:**
- Spinner rotation: 360deg, 0.8s linear infinite

#### 5. Toggle Switch Animation

**On Toggle:**
- Circle slides with ease-in-out
- Background color cross-fades
- Small sparkle particle effect ✨
- Duration: 0.3s

#### 6. Modal Animations

**On Open:**
- Overlay: fade in (0.2s)
- Modal: slide up from bottom (0.3s) + fade in
- Slight overshoot with bounce

**On Close:**
- Modal: slide down + fade out (0.2s)
- Overlay: fade out (0.3s)

#### 7. Priority Badge Pulse (Critical tasks)

**Animation:**
```css
@keyframes gentlePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

/* Apply to critical priority */
animation: gentlePulse 2s ease-in-out infinite;
```

#### 8. Success Confirmation

**When task completed:**
- Confetti particles (very subtle, 3-5 particles)
- Gentle rainbow gradient flash on card
- Checkmark scales with bounce
- Duration: 0.6s

#### 9. Skeleton Loading States

**For async content:**
- Shimmer effect across placeholder
- Background: `--pookie-gray-light`
- Shimmer: lighter gradient moving left to right
- Duration: 1.5s infinite

```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```

---

## AI Natural Language Processing

### Overview

The AI chatbot understands natural language commands and provides conversational task management. It uses OpenAI GPT-4 or Claude API with custom system prompts and function calling.

### AI Personality & Tone

**Core Personality:**
- Friendly and supportive
- Gentle and encouraging
- Uses "pookie" occasionally as term of endearment
- Never condescending or robotic
- Celebratory of accomplishments

**Example Responses:**
- ✅ "Done, pookie! I've marked 'Buy groceries' as complete ♡"
- ✅ "Great! I moved your 3 work tasks to Monday evening. You've got this!"
- ✅ "Oops! I couldn't find task #42. Did you mean task #4?"
- ❌ "TASK_COMPLETED_SUCCESSFULLY" (too robotic)
- ❌ "I have executed your command." (too formal)

### Supported Command Categories

#### 1. Task Creation

**User inputs:**
- "Add [task description]"
- "Create a task to [description]"
- "Remind me to [description]"
- "I need to [description]"
- Natural: "Buy milk tomorrow at 5pm"

**AI extracts:**
- Task title/description
- Due date/time (if mentioned)
- Priority (if mentioned: important, urgent, asap)
- Category (if mentioned: work, personal, shopping)

**Examples:**
```
User: "Add buy milk tomorrow at 5pm #shopping"
AI extracts:
  - title: "buy milk"
  - due: tomorrow at 5:00 PM
  - category: "shopping"

User: "Remind me to call dentist next Monday, it's important"
AI extracts:
  - title: "call dentist"
  - due: next Monday (time: 9:00 AM default)
  - priority: high
```

**AI Response:**
```
"Got it! I've added 'Buy milk' for tomorrow at 5:00 PM
in your shopping list ♡

Want me to set a higher priority on that?"
```

#### 2. Task Completion

**User inputs:**
- "Mark [task identifier] as done/complete"
- "I finished [task]"
- "Complete task [number]"
- "Check off [task]"
- Natural: "I bought the milk"

**AI identifies task by:**
- Task ID number
- Task title (fuzzy match)
- Context ("that one", "the dentist one")

**Examples:**
```
User: "Mark task 3 as done"
AI: Marks task #3 complete

User: "I finished buying milk"
AI: Finds task with title "buy milk", marks complete

User: "Complete the dentist appointment"
AI: Fuzzy matches "call dentist" task
```

**AI Response:**
```
"Awesome! ✓ Task #3 'Buy milk' is now complete.
You're crushing it today, pookie! ♡"
```

#### 3. Task Deletion

**User inputs:**
- "Delete task [number]"
- "Remove [task]"
- "Cancel [task]"
- "I don't need to [task] anymore"

**Examples:**
```
User: "Delete task 5"
AI: Deletes task #5

User: "I don't need to buy milk anymore"
AI: Finds and deletes "buy milk" task
```

**AI Response (with confirmation):**
```
"Are you sure you want to delete 'Buy milk'?
Just checking! ♡

Reply 'yes' to confirm or 'no' to keep it."
```

#### 4. Task Updates

**User inputs:**
- "Update task [number]"
- "Change [task] to [new description]"
- "Rename [task]"
- "Move [task] to [new date/time]"

**Examples:**
```
User: "Change task 3 to 'buy oat milk instead'"
AI: Updates task #3 description

User: "Move the dentist appointment to Friday at 2pm"
AI: Updates due date/time

User: "Make the grocery task high priority"
AI: Updates priority level
```

**AI Response:**
```
"Updated! Task #3 now says 'Buy oat milk instead' ♡
Anything else you'd like to change?"
```

#### 5. Task Queries & Filtering

**User inputs:**
- "Show me [filter]"
- "What tasks do I have [timeframe]"
- "List my [category] tasks"
- "What's due today?"

**Filters:**
- By time: today, tomorrow, this week, next week, overdue
- By category: work, personal, shopping, etc.
- By priority: important, urgent, high priority
- By status: completed, pending, all

**Examples:**
```
User: "Show me my work tasks"
AI: Lists all tasks tagged #work

User: "What's due today?"
AI: Lists all tasks with today's due date

User: "Show completed tasks from this week"
AI: Lists completed tasks with filter
```

**AI Response:**
```
"Here are your work tasks, pookie! ♡

1. [ ] Fix login bug - Due: Tomorrow
2. [ ] Review PR #42 - Due: Friday
3. [x] Deploy to staging - Completed

You have 2 pending work tasks. Need help with any?"
```

#### 6. Bulk Operations

**User inputs:**
- "Mark all [filter] tasks as done"
- "Delete all completed tasks"
- "Move all [category] tasks to [time]"
- "Make all work tasks high priority"

**Examples:**
```
User: "Mark all shopping tasks as done"
AI: Completes all tasks tagged #shopping

User: "Move all work tasks to Monday evening"
AI: Updates due date for all #work tasks to Monday 6:00 PM

User: "Delete all completed tasks"
AI: Removes all tasks with status=complete
```

**AI Response (with summary):**
```
"Done! I've moved 4 work tasks to Monday at 6:00 PM ♡

- Fix login bug
- Review PR #42
- Update documentation
- Team standup

You'll be all set for Monday! 💪"
```

#### 7. Context & Follow-ups

**AI remembers conversation context:**

```
User: "Add buy milk"
AI: "Added! 'Buy milk' is on your list ♡"

User: "Make it high priority"
AI: (knows "it" = buy milk task)
    "Got it! 'Buy milk' is now high priority."

User: "And add it to shopping category"
AI: (still tracking same task)
    "Perfect! Tagged with #shopping ♡"
```

#### 8. Smart Suggestions

**AI proactively suggests:**

```
User: "Add review code"
AI: "Added 'Review code' ♡

   Quick question - is this work-related?
   I can tag it #work for you!"

User: "Add meeting with Sarah"
AI: "Added! When is this meeting? I can set a
   reminder for you ♡"
```

### Natural Language Date/Time Parsing

**Relative dates:**
- "tomorrow" → next day
- "next Monday" → upcoming Monday
- "in 3 days" → +3 days
- "next week" → 7 days from now
- "end of month" → last day of current month

**Specific dates:**
- "December 31" → Dec 31 of current year
- "12/31" → Dec 31
- "31st" → 31st of current month

**Times:**
- "at 5pm" → 17:00
- "5:30 PM" → 17:30
- "morning" → 9:00 AM (default)
- "afternoon" → 2:00 PM (default)
- "evening" → 6:00 PM (default)
- "noon" → 12:00 PM

**Combined:**
- "tomorrow at 3pm" → tomorrow, 15:00
- "next Friday morning" → next Friday, 9:00 AM
- "December 31 at 5:30pm" → Dec 31, 17:30

### Error Handling

**AI handles errors gracefully:**

**Ambiguous input:**
```
User: "Delete that task"
AI: "Which task would you like to delete, pookie?
   Could you give me the task number or title? ♡"
```

**Task not found:**
```
User: "Complete task 99"
AI: "Hmm, I couldn't find task #99.
   Type 'list' to see all your tasks! ♡"
```

**Invalid operation:**
```
User: "Move completed tasks to tomorrow"
AI: "Oops! I can't move completed tasks to a new date.
   Did you want to mark them as incomplete first? ♡"
```

### AI Response Format

**Structure:**
1. Acknowledgment (brief)
2. Action confirmation (what was done)
3. Optional follow-up question or suggestion
4. Warm closing (occasional)

**Good examples:**
```
"Done! ♡ Task #3 is now complete."

"Perfect! I've added 'Buy groceries' for tomorrow at 5pm
in your shopping list. Anything else?"

"Got it! All 3 work tasks have been moved to Monday evening.
You're all set! ♡"
```

### AI Function Calling

**AI has access to these functions:**

```typescript
interface AIFunctions {
  createTask(params: {
    title: string;
    dueDate?: Date;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    category?: string;
  }): Task;

  updateTask(params: {
    taskId: number;
    updates: Partial<Task>;
  }): Task;

  deleteTask(taskId: number): boolean;

  markComplete(taskId: number): Task;

  markIncomplete(taskId: number): Task;

  listTasks(filters?: {
    category?: string;
    priority?: string;
    dueDate?: DateRange;
    status?: 'complete' | 'pending';
  }): Task[];

  bulkUpdate(params: {
    filter: TaskFilter;
    updates: Partial<Task>;
  }): Task[];
}
```

**AI decides which function to call based on user intent.**

### Example AI Chat Flows

#### Flow 1: Creating a task with natural language

```
User: "I need to buy milk tomorrow at 5pm, it's important"

AI thinking:
- Intent: Create task
- Title: "buy milk"
- Due: tomorrow, 17:00
- Priority: high (user said "important")
- Category: likely shopping (milk = grocery)

AI calls: createTask({
  title: "Buy milk",
  dueDate: "2025-01-02T17:00:00",
  priority: "high",
  category: "shopping"
})

AI response:
"Got it, pookie! ♡ I've added 'Buy milk' for tomorrow
at 5:00 PM with high priority. Tagged it #shopping too!

Need anything else?"
```

#### Flow 2: Bulk operation with context

```
User: "Show my work tasks"

AI calls: listTasks({ category: "work" })

AI response:
"Here are your work tasks! ♡

1. [ ] Fix login bug - Due: Tomorrow
2. [ ] Review PR #42 - Due: Friday
3. [ ] Update docs - No due date

You have 3 work tasks. Need help with any?"

User: "Move them all to next Monday evening"

AI thinking:
- Intent: Bulk update
- Filter: category = "work"
- Update: dueDate = next Monday, 6:00 PM
- Uses context from previous query

AI calls: bulkUpdate({
  filter: { category: "work" },
  updates: { dueDate: "2025-01-06T18:00:00" }
})

AI response:
"Done! All 3 work tasks are now scheduled for
Monday evening at 6:00 PM ♡

You're all set for next week! 💪"
```

#### Flow 3: Fuzzy matching and confirmation

```
User: "Delete the dentist thing"

AI thinking:
- Intent: Delete
- Identifier: "dentist thing" (fuzzy)
- Search tasks for match
- Found: Task #5 "Call dentist appointment"

AI response:
"I found 'Call dentist appointment' (#5).
Want me to delete it? ♡

Reply 'yes' to confirm or 'no' to keep it."

User: "yes"

AI calls: deleteTask(5)

AI response:
"Deleted! Task #5 is gone ♡"
```

---

## Responsive Behavior

### Breakpoint System

```css
/* Mobile first approach */
--breakpoint-sm: 640px   /* Small tablets */
--breakpoint-md: 768px   /* Tablets */
--breakpoint-lg: 1024px  /* Laptops */
--breakpoint-xl: 1280px  /* Desktops */
--breakpoint-2xl: 1536px /* Large desktops */
```

### Layout Adaptations

#### Desktop (≥ 1024px)

**Dashboard Layout:**
- Two-column: 60% todos, 40% chatbot
- Chatbot panel sticky/fixed
- Todo cards in grid (2 columns if width allows)
- All hover states active
- Full feature set visible

**Header:**
- Full horizontal with logo, search, profile
- Search bar 400px max-width

**Todo Panel:**
- Max width: none
- Comfortable spacing
- Cards display with all metadata visible

**Chatbot Panel:**
- Fixed position, height 100vh - header
- Sticky scroll
- Always visible

#### Tablet (768px - 1023px)

**Dashboard Layout:**
- Single column layout
- Chatbot as bottom drawer (collapsible)
- Floating action button (FAB) to toggle chat
- Todo cards full-width

**Header:**
- Simplified: logo + hamburger menu
- Search in dropdown or separate page

**Todo Panel:**
- Full width
- Max-width: 800px, centered
- Normal padding

**Chatbot:**
- Bottom sheet, 50vh height when open
- Swipe down to close
- FAB: 56px circle, bottom-right, `--pookie-lavender`
- FAB icon: chat bubble or sparkle

**Interactions:**
- Touch-optimized (larger tap targets)
- Swipe gestures for chatbot drawer

#### Mobile (< 768px)

**Dashboard Layout:**
- Single column, full width
- Chatbot as full-screen modal or drawer
- Bottom navigation (optional)
- Simplified card display

**Header:**
- Mobile-optimized: logo + menu icon
- Height: 56px
- No search in header (move to body or separate)

**Todo Panel:**
- Full width, no max-width
- Reduced padding: `--space-4`
- Cards stack vertically

**Todo Cards:**
- Simplified layout
- Hide metadata on list view
- Tap card to expand details
- Actions always visible (no hover)

**Chatbot:**
- Full-screen overlay when open
- Slide up from bottom animation
- Close button top-left
- Input bar fixed at bottom

**Quick Add:**
- Sticky at top of todo panel
- Simplified single input
- Add button always visible

**Filter Tabs:**
- Horizontal scroll if needed
- Snap scrolling
- Centered active tab

**Interactions:**
- All touch targets minimum 44px
- Swipe gestures:
  - Swipe right on card → mark complete
  - Swipe left on card → delete (with confirm)
  - Pull down to refresh
- Native-feeling scrolling

### Component Adaptations

**Todo Card on Mobile:**
```
┌─────────────────────────────┐
│  □  Fix login bug      [!]  │
│     Tomorrow, 3:00 PM       │
│     #work                   │
│                             │
│  [Tap to see details]       │
└─────────────────────────────┘
```

**Expanded on tap:**
```
┌─────────────────────────────┐
│  □  Fix login bug      [!]  │
│     📅 Tomorrow, 3:00 PM    │
│     #work  #urgent          │
│     ────────────────────    │
│     Created: Yesterday      │
│     ────────────────────    │
│     [Edit] [Delete]         │
└─────────────────────────────┘
```

### Touch Interactions

**Gestures:**
1. **Swipe right on todo card** → Mark complete (with visual feedback)
2. **Swipe left on todo card** → Delete (show confirmation)
3. **Long press on card** → Show quick action menu
4. **Pull down on list** → Refresh (future: sync)
5. **Swipe down on chatbot** → Close drawer

**Visual feedback:**
- Card slides with finger during swipe
- Color hint (green for complete, red for delete)
- Haptic feedback (if supported)
- Bounce back animation if swipe incomplete

### Orientation Changes

**Portrait (default):**
- Standard layouts as described

**Landscape (mobile/tablet):**
- Reduce header height
- Increase content area
- Chatbot as side drawer (mobile landscape)
- Adjust spacing for shorter viewport

---

## User Flows

### Flow 1: User Sign-Up & Onboarding

**Step 1: Visit Landing/Login Page**
- User navigates to app URL
- Sees login page with "Sign Up" link

**Step 2: Click Sign Up**
- Link changes form to sign-up mode
- Fields: Email, Password, Confirm Password
- Button text: "Create Account"

**Step 3: Submit Form**
- Validation runs (client-side)
- If valid → API call to `/api/auth/signup`
- Loading state displayed

**Step 4: Account Creation**
- Backend creates user account
- Generates JWT token
- Returns session token

**Step 5: Automatic Login**
- Token stored in httpOnly cookie
- Redirect to `/dashboard`

**Step 6: Welcome Experience**
- Dashboard loads with empty state
- Chatbot shows welcome message
- Tutorial tooltip (optional): "Try adding your first task!"

**AI Welcome Message:**
```
"Hi pookie! ♡ Welcome to your new todo space!

I'm your AI assistant - I'm here to help you manage
tasks using natural language.

Try saying:
• "Add buy groceries tomorrow"
• "Remind me to call dentist next Monday"
• "Show my tasks for today"

What would you like to add first? ✨"
```

---

### Flow 2: Adding a Task via Quick Add Bar

**Step 1: User Focuses Input**
- Click/tap quick add input
- Input expands (if collapsed)
- Placeholder: "Add a new task... ♡"

**Step 2: User Types**
- Text: "Buy milk tomorrow at 5pm #shopping !high"
- Real-time validation (character count)

**Step 3: User Submits**
- Press Enter OR click Add button
- Input value sent to backend
- Natural language parsing

**Step 4: Task Created**
- Backend extracts:
  - Title: "Buy milk"
  - Due: tomorrow, 17:00
  - Category: "shopping"
  - Priority: "high"
- Task saved to database
- Response sent to frontend

**Step 5: UI Updates**
- New card appears with animation (slide-in + fade)
- Input clears
- Success toast (optional): "Task added! ♡"
- Card scrolls into view if not visible

**Step 6: Focus Returns**
- Cursor back in input (ready for next task)

---

### Flow 3: Completing a Task via Chatbot

**Step 1: User Opens Chatbot**
- Click chatbot panel (desktop) OR
- Click FAB (mobile/tablet) → drawer opens

**Step 2: User Types Command**
- Input: "Mark task 3 as done"
- Press Enter or click send

**Step 3: Message Sent**
- User message appears in chat (right-aligned bubble)
- Loading indicator shows (AI is typing...)

**Step 4: AI Processes**
- API call to `/api/ai/chat`
- Backend LLM extracts intent:
  - Action: complete task
  - Task ID: 3
- Function call: `markComplete(3)`

**Step 5: Task Updated**
- Database updates task status
- Response generated

**Step 6: AI Responds**
- Typing indicator stops
- AI message appears (left-aligned bubble)
- Text: "Awesome! ✓ Task #3 'Buy milk' is now complete. You're crushing it, pookie! ♡"

**Step 7: UI Reflects Change**
- Todo card #3 updates in real-time:
  - Checkbox animates to checked
  - Card fades slightly
  - Strikethrough on title
  - Card may move to "Completed" filter

**Step 8: User Can Continue**
- Chat input ready for next command

---

### Flow 4: Bulk Operation - Moving Tasks

**Step 1: User Queries Tasks**
- User message: "Show my work tasks"
- AI lists all #work tasks

**Step 2: User Requests Bulk Change**
- User message: "Move them all to Monday evening"
- AI understands context ("them" = work tasks from previous query)

**Step 3: AI Processes**
- Intent: Bulk update
- Filter: category="work"
- Update: dueDate = next Monday, 18:00
- Function call: `bulkUpdate({ filter: { category: "work" }, updates: { dueDate: "2025-01-06T18:00:00" } })`

**Step 4: Confirmation (Optional)**
- AI may ask: "I'm about to move 4 work tasks to Monday at 6pm. Sound good? ♡"
- User: "Yes"

**Step 5: Update Executed**
- Database updates all matching tasks
- Returns updated tasks

**Step 6: AI Confirms**
- Message: "Done! All 4 work tasks are now scheduled for Monday evening at 6:00 PM ♡"
- Lists affected tasks

**Step 7: UI Updates**
- All affected cards update in real-time
- Due date changes visible
- Cards may re-sort based on active filter

---

### Flow 5: Editing a Task

**Step 1: User Triggers Edit**
- **Desktop:** Hover over card → click "Edit" button
- **Mobile:** Tap card → expanded view → tap "Edit"

**Step 2: Modal Opens**
- Edit task modal appears
- Fields pre-filled with current values:
  - Title
  - Due date/time
  - Priority
  - Category tags

**Step 3: User Makes Changes**
- Update fields as needed
- Real-time validation

**Step 4: User Saves**
- Click "Save Changes" button
- API call to `/api/todos/:id` (PATCH)
- Loading state on button

**Step 5: Task Updated**
- Backend updates database
- Returns updated task

**Step 6: UI Updates**
- Modal closes with fade-out
- Card updates with new values
- Subtle highlight animation on card
- Success toast: "Task updated! ♡"

---

### Flow 6: Filtering & Viewing Tasks

**Step 1: User Clicks Filter Tab**
- Example: Click "Today" tab

**Step 2: UI Updates**
- Tab animates to active state
- Current cards fade out

**Step 3: Data Fetches (if needed)**
- API call to `/api/todos?filter=today`
- Loading state (skeleton cards)

**Step 4: Filtered Cards Display**
- New cards fade in with stagger
- Only tasks due today shown
- Empty state if no tasks: "No tasks for today, pookie! ✨ Enjoy your free time ♡"

**Step 5: Filter Persists**
- State saved (local storage)
- Remains active on page reload

---

### Flow 7: Deleting a Task

**Step 1: User Initiates Delete**
- **Desktop:** Hover card → click "Delete"
- **Mobile:** Swipe left OR tap card → "Delete" button
- **Chatbot:** "Delete task 5"

**Step 2: Confirmation Prompt**
- Modal or confirmation dialog appears
- Text: "Are you sure you want to delete 'Buy milk'?"
- Buttons: "Cancel" (secondary) | "Delete" (danger, red-tinted)

**Step 3: User Confirms**
- Click "Delete"
- API call to `/api/todos/:id` (DELETE)
- Loading state

**Step 4: Task Deleted**
- Backend removes from database
- Success response

**Step 5: UI Updates**
- Confirmation closes
- Card animates out (scale + fade + slide)
- Gap closes smoothly
- Success toast: "Task deleted"

**Step 6: Undo Option (Optional)**
- Toast includes "Undo" button
- 5-second window to restore
- If clicked → task recreated

---

## Acceptance Criteria

### AC-1: Visual Design

- [ ] All colors match pookie pastel palette specified
- [ ] Border radius consistent (8px, 12px, 16px, 24px, 9999px)
- [ ] Shadows applied correctly to components
- [ ] Typography scale followed (sizes, weights, fonts)
- [ ] Spacing system used consistently (4px base unit)
- [ ] All components have proper hover/focus/active states
- [ ] Design feels cohesive and "pookie-style" cute

### AC-2: Authentication

- [ ] Login page renders correctly
- [ ] Sign-up flow works end-to-end
- [ ] Form validation prevents invalid submissions
- [ ] Error messages display for invalid credentials
- [ ] Successful login redirects to dashboard
- [ ] JWT token stored securely (httpOnly cookie)
- [ ] Logout functionality works
- [ ] Protected routes require authentication
- [ ] Unauthorized users redirected to login

### AC-3: Todo Dashboard Layout

- [ ] Header displays correctly with logo, search, profile
- [ ] Two-column layout on desktop (60/40 split)
- [ ] Todo panel shows quick add bar
- [ ] Filter tabs render and function
- [ ] Chatbot panel visible and sticky on desktop
- [ ] Empty state displays when no tasks exist
- [ ] All components properly aligned and spaced

### AC-4: Todo Cards

- [ ] Cards display all metadata (title, due date, category, priority)
- [ ] Checkbox toggles task completion
- [ ] Completed tasks show strikethrough and fade
- [ ] Hover reveals action buttons (desktop)
- [ ] Actions always visible on mobile
- [ ] Priority badge displays correctly based on level
- [ ] Category tags render with proper styling
- [ ] Due date formats correctly (Today, Tomorrow, specific dates)
- [ ] Overdue tasks highlighted in red/rose color
- [ ] Cards animate on add/delete/update

### AC-5: Quick Add Bar

- [ ] Input field accepts task text
- [ ] Enter key creates task
- [ ] Add button creates task
- [ ] Natural language parsing works (date, time, category, priority)
- [ ] Input clears after submission
- [ ] Focus returns to input after add
- [ ] Validation prevents empty tasks
- [ ] Loading state shows during creation

### AC-6: AI Chatbot Panel

- [ ] Panel displays on desktop (sticky)
- [ ] Panel toggles via FAB on mobile/tablet
- [ ] Welcome message shows on first visit
- [ ] Chat input accepts text
- [ ] Messages display in correct bubbles (user right, AI left)
- [ ] Typing indicator shows while AI processes
- [ ] Timestamps display on messages
- [ ] Chat auto-scrolls to latest message
- [ ] Send button disabled when input empty

### AC-7: AI Natural Language Processing

- [ ] AI correctly parses "Add [task]" commands
- [ ] AI extracts due dates from natural language
- [ ] AI extracts priority from keywords (important, urgent)
- [ ] AI extracts categories from hashtags
- [ ] AI can mark tasks complete by ID or title
- [ ] AI can delete tasks with confirmation
- [ ] AI can update tasks
- [ ] AI can filter/list tasks by criteria
- [ ] AI performs bulk operations correctly
- [ ] AI maintains conversation context
- [ ] AI responses are friendly and match personality
- [ ] AI handles errors gracefully with helpful messages

### AC-8: Example Commands Work

- [ ] "Make this task cute and mark done" - works (with fuzzy matching)
- [ ] "Move my work todos to tomorrow evening" - works (bulk operation)
- [ ] "Add buy milk tomorrow at 5pm" - creates task with due date
- [ ] "Show my tasks for today" - filters correctly
- [ ] "Delete all completed tasks" - bulk delete with confirmation
- [ ] "Mark task 3 as high priority" - updates priority

### AC-9: Animations & Transitions

- [ ] Page load animations work (stagger effect)
- [ ] Card hover animations smooth (lift + shadow)
- [ ] Checkbox completion animates (scale bounce)
- [ ] New card appears with fade-in + scale
- [ ] Deleted card animates out (fade + slide + collapse)
- [ ] Chat messages slide in appropriately
- [ ] Typing indicator dots bounce
- [ ] Button hover/click animations work
- [ ] Toggle switch animates smoothly
- [ ] Modal open/close animations smooth
- [ ] All transitions use proper easing curves
- [ ] Critical priority badge has gentle pulse

### AC-10: Responsive Design

- [ ] Desktop layout (≥1024px) works correctly
- [ ] Tablet layout (768-1023px) adapts properly
- [ ] Mobile layout (<768px) displays correctly
- [ ] Chatbot switches to drawer on tablet
- [ ] Chatbot switches to modal on mobile
- [ ] FAB appears on mobile/tablet
- [ ] Touch targets minimum 44px on mobile
- [ ] Swipe gestures work on mobile (complete/delete)
- [ ] Header adapts to smaller screens
- [ ] Filter tabs scroll horizontally on mobile
- [ ] Cards stack properly on mobile
- [ ] All text readable at all sizes
- [ ] No horizontal scroll on any breakpoint

### AC-11: Filtering & Views

- [ ] "All" filter shows incomplete tasks
- [ ] "Today" filter shows tasks due today
- [ ] "Upcoming" shows tasks due in next 7 days
- [ ] "Completed" shows completed tasks
- [ ] Filter state persists on reload
- [ ] Empty state displays when filter has no results
- [ ] Cards re-sort when filter changes
- [ ] Active filter tab highlighted

### AC-12: Data Persistence

- [ ] Tasks saved to database
- [ ] Tasks persist across sessions
- [ ] User data isolated (can't see other users' tasks)
- [ ] Real-time updates reflect in UI
- [ ] Optimistic updates for better UX
- [ ] Data syncs after offline (Phase IV)

### AC-13: Performance

- [ ] Page loads in under 2 seconds
- [ ] Task operations complete in under 300ms
- [ ] Animations run at 60fps
- [ ] No jank during scrolling
- [ ] AI responses return in under 3 seconds (average)
- [ ] Images/assets optimized
- [ ] Code split for faster initial load

### AC-14: Accessibility

- [ ] All interactive elements keyboard accessible
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] ARIA labels on icon buttons
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader compatible (basic)
- [ ] Form inputs have labels
- [ ] Error messages announced

### AC-15: Error Handling

- [ ] Network errors display user-friendly messages
- [ ] Failed task operations show error toast
- [ ] Invalid form inputs prevented with validation
- [ ] 404/500 errors have custom pages
- [ ] AI errors explained clearly
- [ ] Offline state detected and communicated (Phase IV)

### AC-16: Code Quality

- [ ] TypeScript strict mode enabled
- [ ] Zero TypeScript errors
- [ ] Zero linting errors
- [ ] All components properly typed
- [ ] Code follows consistent style
- [ ] Components modular and reusable
- [ ] No console errors in production

### AC-17: Testing

- [ ] Unit tests for components
- [ ] Integration tests for user flows
- [ ] E2E tests for critical paths
- [ ] AI chat functionality tested
- [ ] Responsive design tested on real devices
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Test coverage ≥70%

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 3.0.0 | 2025-12-31 | Human Architect | Initial Phase III specification - UI/UX focused |

---

## Approval

**Specification Status:** Ready for Implementation

**Next Steps:**
1. Review and approve this specification
2. Set up development environment (React + backend)
3. Implement design system and component library
4. Build authentication and dashboard
5. Integrate AI chatbot with NLP
6. Test against acceptance criteria
7. Deploy Phase III

---

**Document Owner:** Human Architect
**Implementation Owner:** Claude Code
**Governed By:** CONSTITUTION.md v1.0.0

---

**End of Specification** ♡
