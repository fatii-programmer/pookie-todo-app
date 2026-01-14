# Evolution of Todo - Phase III Complete Specification
## Conversational AI with "Pookie" Aesthetic

**Version:** 3.0-Complete
**Date:** 2025-12-31
**Status:** Ready for Implementation
**Governed By:** CONSTITUTION.md v1.0.0, UI-CONSTITUTION.md v3.0-UI
**Extends:** SPEC-PHASE-I.md, SPEC-PHASE-II.md

---

## Table of Contents
1. [Overview](#overview)
2. [Application Architecture](#application-architecture)
3. [Design Language](#design-language)
4. [Page Specifications](#page-specifications)
5. [Component Specifications](#component-specifications)
6. [Animation & Transitions](#animation--transitions)
7. [AI Conversational Flows](#ai-conversational-flows)
8. [Natural Language Commands](#natural-language-commands)
9. [Responsive Behavior](#responsive-behavior)
10. [Acceptance Criteria](#acceptance-criteria)

---

## Overview

### Vision
Transform the todo application into a delightful, AI-powered conversational experience with Netflix-level UI polish and a cute "pookie" aesthetic. Users manage tasks through natural conversation with an AI assistant named Pookie, presented in a beautiful glassmorphic interface with pastel colors and smooth animations.

### Key Differentiators
- **Conversational-first:** Chat with Pookie instead of filling forms
- **Visually delightful:** Glassmorphism, pastels, smooth animations
- **Natural language:** "Move my work todos to tomorrow evening" just works
- **Personality:** Pookie celebrates wins, encourages progress, stays cute
- **Mobile-optimized:** Touch-friendly, thumb-reachable, responsive

### Technology Stack
**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (state management)
- React Query (server state)

**Backend:**
- FastAPI (from Phase III spec)
- OpenAI Agents SDK
- PostgreSQL
- Redis

---

## Application Architecture

### Frontend Structure
```
┌─────────────────────────────────────────────────────┐
│                   Next.js App                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌───────────────────────────┐  │
│  │              │  │                           │  │
│  │  Sidebar     │  │  Main Content Area        │  │
│  │              │  │                           │  │
│  │  - Logo      │  │  Dashboard or Chat View   │  │
│  │  - Nav       │  │                           │  │
│  │  - Stats     │  │                           │  │
│  │              │  │                           │  │
│  └──────────────┘  └───────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │        AI Chat Panel (Pookie)               │  │
│  │        (Expandable/Collapsible)             │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Application Routes
```
/ (root)
├── /login          → Authentication page
├── /dashboard      → Main todo dashboard
│   ├── /today      → Today's tasks view
│   ├── /upcoming   → Upcoming tasks
│   └── /completed  → Completed tasks archive
├── /settings       → User preferences
└── /api            → API routes (Next.js API)
    ├── /auth       → Authentication endpoints
    └── /proxy      → Proxy to FastAPI backend
```

### State Management

**Client State (Zustand):**
```typescript
interface AppState {
  // UI State
  isSidebarOpen: boolean;
  isChatPanelOpen: boolean;
  activeView: 'dashboard' | 'today' | 'upcoming' | 'completed';

  // Chat State
  messages: Message[];
  isTyping: boolean;

  // User Preferences
  theme: 'light' | 'dark';
  animationsEnabled: boolean;
  soundEnabled: boolean;
}
```

**Server State (React Query):**
```typescript
// Queries
useTasksQuery()           // Fetch all tasks
useSessionQuery()         // Current session
useAnalyticsQuery()       // Usage stats

// Mutations
useCreateTaskMutation()   // Create task
useUpdateTaskMutation()   // Update task
useDeleteTaskMutation()   // Delete task
useSendMessageMutation()  // Send chat message
```

---

## Design Language

### Color Palette

#### Primary Pastel Colors
```typescript
const colors = {
  lavender: {
    50: '#FAF8FF',   // Background tints
    100: '#F3EFFF',  // Hover states
    200: '#E6DBFF',  // Borders
    300: '#D4C2FF',  // Accents
    400: '#C1A3FF',
    500: '#A87EFF',  // Primary actions
    600: '#8F5CFF',
    700: '#7640E0',  // Text on light bg
  },
  mint: {
    50: '#F0FFF9',
    100: '#DBFFF0',
    200: '#B8FFE3',
    300: '#8FFFD4',  // Success indicator
    400: '#5EFFC4',
    500: '#2DFFB3',  // Success actions
    600: '#00E699',
  },
  peach: {
    50: '#FFF8F5',
    100: '#FFE9DC',
    200: '#FFD4C2',
    300: '#FFBDA3',  // Warning indicator
    400: '#FFA684',
    500: '#FF8E64',  // Warning actions
  },
  rose: {
    50: '#FFF5F7',
    100: '#FFE3E9',
    200: '#FFC9D6',
    300: '#FFADC2',  // Error indicator
    400: '#FF8FAC',
    500: '#FF6B96',  // Error actions
  },
  neutral: {
    50: '#FAFAFA',   // White equivalent
    100: '#F5F5F5',  // Light backgrounds
    200: '#E5E5E5',
    300: '#D4D4D4',
    500: '#737373',  // Secondary text
    700: '#404040',  // Primary text
    900: '#171717',  // Headings
  }
};
```

#### Gradient Definitions
```css
/* Page Background */
.bg-pookie-gradient {
  background: linear-gradient(135deg,
    #FAF8FF 0%,    /* lavender-50 */
    #F0FFF9 50%,   /* mint-50 */
    #FFF8F5 100%   /* peach-50 */
  );
}

/* Glass Card Overlay */
.glass-overlay {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
}

/* Primary Button */
.btn-primary-gradient {
  background: linear-gradient(90deg,
    #A87EFF 0%,   /* lavender-500 */
    #2DFFB3 100%  /* mint-500 */
  );
}

/* Priority High */
.priority-high-gradient {
  background: linear-gradient(90deg,
    #FF6B96 0%,   /* rose-500 */
    #FFA684 100%  /* peach-400 */
  );
}
```

### Typography

**Font Stack:**
```css
--font-primary: 'Inter Variable', -apple-system, sans-serif;
--font-display: 'Cal Sans', 'Inter Variable', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

**Type Scale:**
```typescript
const typography = {
  // Display
  hero: {
    fontSize: '48px',
    lineHeight: '56px',
    fontWeight: 700,
    fontFamily: 'Cal Sans',
    letterSpacing: '-0.02em',
  },

  // Headings
  h1: { fontSize: '36px', lineHeight: '40px', fontWeight: 600 },
  h2: { fontSize: '30px', lineHeight: '36px', fontWeight: 600 },
  h3: { fontSize: '24px', lineHeight: '32px', fontWeight: 600 },
  h4: { fontSize: '20px', lineHeight: '28px', fontWeight: 600 },

  // Body
  bodyLarge: { fontSize: '18px', lineHeight: '28px', fontWeight: 400 },
  body: { fontSize: '16px', lineHeight: '24px', fontWeight: 400 },
  bodySmall: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },

  // UI
  caption: { fontSize: '12px', lineHeight: '16px', fontWeight: 500 },
  label: { fontSize: '14px', lineHeight: '20px', fontWeight: 500 },
};
```

### Spacing System
```typescript
const spacing = {
  xs: '4px',    // 0.5 in Tailwind
  sm: '8px',    // 2
  md: '16px',   // 4
  lg: '24px',   // 6
  xl: '32px',   // 8
  '2xl': '48px', // 12
  '3xl': '64px', // 16
};
```

### Border Radius
```typescript
const borderRadius = {
  sm: '8px',     // Small elements
  md: '12px',    // Default cards
  lg: '16px',    // Large cards
  xl: '20px',    // Panels
  '2xl': '24px', // Modals
  full: '9999px', // Pills, avatars
};
```

---

## Page Specifications

### Page 1: Login/Welcome Page

#### Layout Structure
```
┌─────────────────────────────────────────┐
│                                         │
│         [Pookie Logo/Illustration]      │
│                                         │
│     "Hey! I'm Pookie 👋"               │
│     "Your friendly task companion"      │
│                                         │
│     ┌─────────────────────────────┐    │
│     │  Continue with Google  🔐   │    │
│     └─────────────────────────────┘    │
│                                         │
│     ┌─────────────────────────────┐    │
│     │  Continue with Email   ✉️   │    │
│     └─────────────────────────────┘    │
│                                         │
│     "No account needed - just vibes"    │
│                                         │
└─────────────────────────────────────────┘
```

#### Visual Specification

**Background:**
- Full-screen gradient: `bg-pookie-gradient`
- Animated subtle floating shapes (circles, soft blobs)
- Particles drifting slowly across screen

**Pookie Logo:**
- Cute illustrated character or mascot
- Size: 200x200px on mobile, 300x300px on desktop
- Animation: Gentle bobbing (2s ease-in-out infinite)
- Style: Soft pastel colors, rounded shapes

**Heading:**
- Text: "Hey! I'm Pookie 👋"
- Font: `Cal Sans`, 48px (mobile: 36px)
- Color: `neutral-900`
- Animation: Fade in + slide up (0.8s delay)

**Subheading:**
- Text: "Your friendly task companion"
- Font: `Inter`, 20px (mobile: 18px)
- Color: `neutral-500`
- Animation: Fade in (1.2s delay)

**Auth Buttons:**
- Style: Glass effect (`bg-white/80 backdrop-blur-lg`)
- Padding: `py-4 px-8`
- Border radius: `rounded-2xl`
- Shadow: `shadow-lg`
- Hover: Lift up (`-translate-y-1`), stronger shadow
- Width: 320px max, full width on mobile with margin
- Gap between buttons: `space-y-4`

**Google Button:**
- Icon: Google "G" logo (24px)
- Text: "Continue with Google"
- Gradient border on hover: `border-2 border-lavender-300`

**Email Button:**
- Icon: Email icon (24px)
- Text: "Continue with Email"
- Gradient border on hover: `border-2 border-mint-300`

**Footer Text:**
- Text: "No account needed - just vibes"
- Font: `Inter`, 14px
- Color: `neutral-400`
- Position: Bottom of card area

#### Animations

**Page Load Sequence:**
```
1. Background gradient fades in (0s-0.5s)
2. Floating shapes appear (0.3s-0.8s)
3. Pookie logo scales up + fades in (0.5s-1s)
4. Heading slides up + fades in (0.8s-1.2s)
5. Subheading fades in (1.2s-1.6s)
6. Buttons stagger in (1.5s-2s, 0.1s delay each)
7. Footer text fades in (2s-2.5s)
```

**Idle State:**
- Pookie logo: Gentle bobbing (translateY: -10px to 0px, 2s)
- Floating shapes: Slow drift (5-10s per cycle)
- Subtle pulse on buttons (scale: 1 to 1.02, 3s)

---

### Page 2: Todo Dashboard

#### Layout Structure (Desktop)
```
┌────────────────────────────────────────────────────────┐
│ Sidebar                  │  Main Content              │
│ (280px)                  │  (flex-1)                  │
│                          │                            │
│ ┌──────────────────┐     │  ┌──────────────────────┐ │
│ │ Pookie Avatar    │     │  │  Header              │ │
│ │ "Hey, Sarah!"    │     │  │  "Today's Tasks"     │ │
│ └──────────────────┘     │  │  3 tasks • 2 done    │ │
│                          │  └──────────────────────┘ │
│ Navigation:              │                            │
│  • Today        [3]      │  ┌──────────────────────┐ │
│  • Upcoming     [7]      │  │  Task Card 1         │ │
│  • Completed    [12]     │  └──────────────────────┘ │
│  • All Tasks    [22]     │                            │
│                          │  ┌──────────────────────┐ │
│ Quick Stats:             │  │  Task Card 2         │ │
│  ┌────────────────┐      │  └──────────────────────┘ │
│  │ 📊 This Week   │      │                            │
│  │ 12 completed   │      │  ┌──────────────────────┐ │
│  │ 8 remaining    │      │  │  Task Card 3         │ │
│  │ 🔥 60% done    │      │  └──────────────────────┘ │
│  └────────────────┘      │                            │
│                          │  [+ Add Task Button]       │
│ [Settings ⚙️]            │                            │
└────────────────────────────────────────────────────────┘
│            Chat Panel (Pookie) - Expandable            │
│  "Hey! Need help with anything? 💬"   [Minimize]      │
└────────────────────────────────────────────────────────┘
```

#### Layout Structure (Mobile)
```
┌─────────────────────────┐
│  Header (sticky)        │
│  "Today's Tasks"        │
│  [☰ Menu] [💬 Chat]    │
├─────────────────────────┤
│                         │
│  ┌───────────────────┐ │
│  │  Task Card 1      │ │
│  └───────────────────┘ │
│                         │
│  ┌───────────────────┐ │
│  │  Task Card 2      │ │
│  └───────────────────┘ │
│                         │
│  ┌───────────────────┐ │
│  │  Task Card 3      │ │
│  └───────────────────┘ │
│                         │
├─────────────────────────┤
│  [+ Add Task] (sticky)  │
└─────────────────────────┘
```

#### Header Specification

**Desktop Header:**
- Height: `80px`
- Background: Glass effect (`bg-white/60 backdrop-blur-md`)
- Border bottom: `border-b border-white/30`
- Padding: `px-8 py-4`

**Title:**
- Font: `Cal Sans`, 30px
- Color: `neutral-900`
- Example: "Today's Tasks"

**Stats Pill:**
- Style: Rounded pill (`rounded-full`)
- Background: `bg-lavender-100`
- Padding: `px-4 py-2`
- Text: "3 tasks • 2 done"
- Font: `Inter`, 14px, `font-medium`
- Color: `lavender-700`

**Actions:**
- Filter button: Ghost style, icon + text
- Sort button: Ghost style, icon + text
- View toggle: Grid vs List icons

**Mobile Header:**
- Height: `64px`
- Sticky at top (`sticky top-0`)
- Background: Glass with stronger blur (`bg-white/80 backdrop-blur-lg`)
- Shadow: `shadow-sm`

**Mobile Navigation:**
- Hamburger menu (left): Opens sidebar drawer
- Chat button (right): Opens Pookie chat panel
- Both: Icon buttons, 44x44px, rounded-full

---

#### Sidebar Specification

**Container:**
- Width: `280px` (desktop only)
- Background: Glass (`bg-white/50 backdrop-blur-xl`)
- Border right: `border-r border-white/20`
- Padding: `p-6`
- Height: `100vh`
- Sticky position

**Pookie Avatar Section:**
```
┌─────────────────────┐
│  ┌───┐              │
│  │ 🐰│  "Hey, Sarah!"│
│  └───┘  "You're doing│
│         great! 🌟"   │
└─────────────────────┘
```

- Avatar: 48x48px, rounded-full, gradient border
- Greeting: Font 16px, font-semibold, neutral-900
- Encouragement: Font 14px, neutral-500

**Navigation List:**
- Item structure:
  ```
  [Icon] Label        [Badge]
  ```
- Padding: `py-3 px-4`
- Border radius: `rounded-xl`
- Hover: `bg-lavender-50`, slight scale (1.02)
- Active: `bg-lavender-100`, lavender-700 text
- Transition: All 200ms ease

**Navigation Items:**
```typescript
const navItems = [
  { icon: '📅', label: 'Today', badge: 3, href: '/dashboard/today' },
  { icon: '🔮', label: 'Upcoming', badge: 7, href: '/dashboard/upcoming' },
  { icon: '✅', label: 'Completed', badge: 12, href: '/dashboard/completed' },
  { icon: '📝', label: 'All Tasks', badge: 22, href: '/dashboard' },
];
```

**Badge:**
- Style: `rounded-full`
- Background: `bg-lavender-500`
- Text: `text-white`, 12px, font-semibold
- Padding: `px-2 py-0.5`
- Min width: `24px`

**Quick Stats Card:**
- Background: Glass (`bg-white/60 backdrop-blur-lg`)
- Border: `border border-white/40`
- Border radius: `rounded-2xl`
- Padding: `p-4`
- Shadow: `shadow-md`

**Stats Content:**
```
📊 This Week
12 completed
8 remaining
🔥 60% done
```
- Title: Font 14px, font-semibold, neutral-700
- Numbers: Font 20px, font-bold, lavender-600
- Labels: Font 12px, neutral-500
- Progress emoji: 24px

**Settings Button:**
- Position: Bottom of sidebar
- Style: Ghost button, full width
- Icon: ⚙️ (20px)
- Text: "Settings"

---

#### Main Content Area

**Container:**
- Padding: `p-8` (desktop), `p-4` (mobile)
- Max width: `1200px`
- Margin: `mx-auto`
- Background: Transparent (shows page gradient)

**Task Grid/List:**
- Display: Grid or List (user toggleable)
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Gap: `gap-6`
- List: `space-y-4`

**Empty State:**
```
┌─────────────────────────────┐
│                             │
│     [Cute Illustration]     │
│                             │
│   "All caught up! 🎉"      │
│   "No tasks for today"      │
│                             │
│   [Add your first task]     │
│                             │
└─────────────────────────────┘
```

- Illustration: 200x200px, pastel colors
- Heading: Font 24px, font-semibold
- Subtext: Font 16px, neutral-500
- Button: Primary gradient button

**Add Task Button (Floating):**
- Position: Fixed bottom-right (desktop), sticky bottom (mobile)
- Style: Large circular button (64x64px)
- Background: Primary gradient (`lavender-500` to `mint-500`)
- Icon: Plus sign (28px, white)
- Shadow: `shadow-xl shadow-lavender`
- Hover: Scale 1.1, rotate 90deg
- Bottom: `32px` (desktop), `80px` (mobile, above chat)
- Right: `32px` (desktop), centered (mobile)

---

### Page 3: AI Chat Panel (Pookie)

#### Panel States

**State 1: Minimized (Default)**
```
┌────────────────────────────────────┐
│ 💬 "Chat with Pookie" [Expand ↑]  │
└────────────────────────────────────┘
```
- Height: `60px`
- Position: Fixed bottom
- Width: Full width
- Background: Glass with strong blur
- Click anywhere: Expand panel

**State 2: Expanded**
```
┌────────────────────────────────────┐
│ Header: "Pookie 🐰" [Minimize ↓]  │
├────────────────────────────────────┤
│                                    │
│  Chat Messages Area                │
│  (Scrollable)                      │
│                                    │
│  [Pookie] "Hey! How can I help?"   │
│  [User]   "Show my tasks"          │
│  [Pookie] "Here are your 3 tasks"  │
│                                    │
├────────────────────────────────────┤
│  Input: "Ask Pookie..." [Send →]   │
└────────────────────────────────────┘
```
- Height: `500px` (desktop), `60vh` (mobile)
- Animation: Slide up + fade in (300ms ease-out)

#### Header
- Background: `bg-lavender-100`
- Padding: `p-4`
- Border top left radius: `rounded-tl-3xl`
- Border top right radius: `rounded-tr-3xl`

**Title:**
- Text: "Pookie 🐰"
- Font: 18px, font-semibold
- Color: `lavender-700`

**Minimize Button:**
- Icon: Chevron down
- Style: Icon button, rounded-full
- Size: 36x36px
- Hover: `bg-lavender-200`

#### Messages Area

**Container:**
- Height: Flex-1 (fills available space)
- Padding: `p-6`
- Overflow: Scroll (hidden scrollbar)
- Background: `bg-gradient-to-b from-lavender-50/50 to-mint-50/50`

**Message Alignment:**
- Pookie (AI): Left-aligned
- User: Right-aligned

**Spacing:**
- Gap between messages: `space-y-4`
- Timestamp gap: `mt-1`

#### Input Area

**Container:**
- Background: `bg-white`
- Border top: `border-t border-neutral-200`
- Padding: `p-4`
- Shadow: `shadow-lg` (upward shadow)

**Input Field:**
- Type: Textarea, auto-resize
- Placeholder: "Ask Pookie anything..."
- Background: `bg-neutral-50`
- Border: `border-2 border-transparent`
- Focus border: `border-lavender-300`
- Border radius: `rounded-2xl`
- Padding: `p-4`
- Min height: `56px`
- Max height: `200px`
- Font: 16px (prevents zoom on iOS)

**Send Button:**
- Position: Absolute right inside input
- Style: Circular button (44x44px)
- Background: Primary gradient
- Icon: Arrow right (white, 20px)
- Disabled state: `opacity-50`, `cursor-not-allowed`
- Active state: Scale down to 0.95

**Suggestions (Optional):**
- Appear above input when empty
- Style: Chip buttons
- Examples: "Show my tasks", "Add a task", "What's due today?"

---

## Component Specifications

### Component 1: Task Card

#### Visual Design
```
┌─────────────────────────────────────────┐
│ [🔴] ☐ Buy groceries for dinner        │
│      Due: Tomorrow at 6:00 PM           │
│      #shopping #personal                │
│                                         │
│      [Edit] [Delete] [More...]         │
└─────────────────────────────────────────┘
```

#### Layout Specification

**Container:**
- Background: Glass effect (`bg-white/70 backdrop-blur-md`)
- Border: `border border-white/40`
- Border radius: `rounded-2xl`
- Padding: `p-6`
- Shadow: `shadow-md`
- Transition: All 300ms ease
- Cursor: pointer

**Priority Indicator:**
- Position: Absolute top-left
- Style: Colored dot (12x12px circle)
- Colors:
  - High: `bg-rose-500` (red)
  - Medium: `bg-peach-500` (orange)
  - Low: `bg-mint-500` (green)
- Glow: Matching colored shadow

**Checkbox:**
- Size: 24x24px
- Border: `border-2`
- Border color (unchecked): `border-neutral-300`
- Border color (checked): `border-lavender-500`
- Border radius: `rounded-lg`
- Background (checked): `bg-lavender-500`
- Checkmark: White, animated draw-in
- Hover: Scale 1.1

**Title:**
- Font: 18px, font-medium
- Color: `neutral-900`
- Strikethrough (when checked): Animated line-through
- Max lines: 2 (truncate with ellipsis)
- Margin: `ml-3` (after checkbox)

**Due Date:**
- Font: 14px, font-normal
- Color: `neutral-500`
- Icon: 📅 (16px)
- Format: "Tomorrow at 6:00 PM"
- Special states:
  - Overdue: `text-rose-500`, "⚠️ Overdue"
  - Today: `text-peach-500`, "Today"
  - Soon (<24h): `text-mint-500`

**Tags:**
- Display: Inline flex, wrap
- Gap: `gap-2`
- Margin top: `mt-2`

**Action Buttons:**
- Display: Hidden by default
- Show on: Hover (desktop), Always (mobile)
- Style: Ghost buttons, small size
- Buttons: Edit, Delete, More
- Hover: `bg-lavender-50`

#### States

**Default:**
```css
opacity: 1
scale: 1
shadow: shadow-md
border: border-white/40
```

**Hover (Desktop):**
```css
scale: 1.02
shadow: shadow-lg shadow-lavender/20
border: border-lavender-200
translateY: -4px
```

**Checked/Completed:**
```css
opacity: 0.6
border: border-mint-300
```
- Title: Strikethrough animation (300ms)
- Checkbox: Checkmark draws in (400ms)
- Optional: Confetti animation (subtle)

**Editing:**
```css
border: border-lavender-500 (2px)
shadow: shadow-xl shadow-lavender/40
scale: 1.02
```

**Long Press (Mobile):**
- Vibration feedback
- Context menu appears
- Card slightly scales down (0.98)

#### Animations

**Card Entrance:**
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
```

**Checkbox Toggle:**
```javascript
// Unchecked → Checked
1. Scale down to 0.8 (100ms)
2. Background color fade lavender-500 (200ms)
3. Checkmark path draws in (300ms)
4. Scale back to 1 (100ms)
```

**Delete Animation:**
```javascript
1. Scale down to 0.8 + opacity to 0 (200ms)
2. Height collapses to 0 (200ms)
3. Gap closes with smooth transition (200ms)
```

**Drag to Reorder (Optional):**
```javascript
drag="y"
dragConstraints={{ top: 0, bottom: 0 }}
dragElastic={0.2}
whileDrag={{ scale: 1.05, shadow: 'shadow-2xl' }}
```

---

### Component 2: Priority Badge

#### Visual Design
```
High:   [🔴 High]     Red gradient
Medium: [🟠 Medium]   Orange gradient
Low:    [🟢 Low]      Green gradient
```

#### Specification

**Container:**
- Display: Inline-flex, align-center
- Padding: `px-3 py-1.5`
- Border radius: `rounded-full`
- Gap: `gap-1.5`
- Font: 12px, font-semibold
- Text transform: Uppercase
- Letter spacing: `0.05em`

**High Priority:**
```css
background: linear-gradient(90deg, #FF6B96, #FFA684)
color: white
box-shadow: 0 4px 12px rgba(255, 107, 150, 0.3)
```

**Medium Priority:**
```css
background: linear-gradient(90deg, #FFBDA3, #FFD4C2)
color: #A0522D
box-shadow: 0 4px 12px rgba(255, 189, 163, 0.3)
```

**Low Priority:**
```css
background: linear-gradient(90deg, #8FFFD4, #DBFFF0)
color: #00846A
box-shadow: 0 4px 12px rgba(143, 255, 212, 0.3)
```

**Emoji:**
- Size: 14px
- Vertical align: middle

**Animation:**
```javascript
// On priority change
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: 'spring', stiffness: 400, damping: 20 }}
```

---

### Component 3: Cute Toggle Button

#### Visual Design
```
OFF:  [ ○     ]  Neutral gray
ON:   [     ● ]  Lavender gradient
```

#### Specification

**Track (Background):**
- Width: `56px`
- Height: `32px`
- Border radius: `rounded-full`
- Background (OFF): `bg-neutral-200`
- Background (ON): `bg-gradient-to-r from-lavender-400 to-mint-400`
- Transition: All 300ms ease
- Cursor: pointer
- Border: `border-2 border-transparent`
- Focus border (keyboard): `border-lavender-500`

**Thumb (Circle):**
- Width: `28px`
- Height: `28px`
- Border radius: `rounded-full`
- Background: `bg-white`
- Shadow: `shadow-md`
- Position: Absolute
- Transform: `translateX(2px)` (OFF), `translateX(26px)` (ON)
- Transition: Transform 300ms cubic-bezier(0.4, 0, 0.2, 1)

**Label (Optional):**
- Font: 14px, font-medium
- Color: `neutral-700` (OFF), `lavender-700` (ON)
- Margin: `ml-3`

**States:**

**OFF:**
```css
Track: bg-neutral-200
Thumb: translateX(2px)
```

**ON:**
```css
Track: bg-gradient-to-r from-lavender-400 to-mint-400
Thumb: translateX(26px)
Shadow: shadow-lg shadow-lavender/30
```

**Hover:**
```css
Track: Brightness 110%
Thumb: scale(1.1)
```

**Active (Clicking):**
```css
Thumb: scale(0.95)
```

**Disabled:**
```css
opacity: 0.5
cursor: not-allowed
```

#### Animations

**Toggle Transition:**
```javascript
<motion.div
  className="thumb"
  layout
  transition={{
    type: "spring",
    stiffness: 700,
    damping: 30
  }}
/>
```

**Interaction Feedback:**
```javascript
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
```

**Celebration (Optional):**
- When toggled ON: Tiny sparkles emit from thumb
- Duration: 500ms
- Particles: 5-8 small dots, lavender/mint colors

---

### Component 4: Chat Message Bubble

#### Visual Design

**Pookie Message (Left-aligned):**
```
┌──────────────────────────────┐
│ 🐰                           │
│  ┌────────────────────────┐  │
│  │ Hey! I've added that   │  │
│  │ task for you 🎯        │  │
│  └────────────────────────┘  │
│  10:23 AM                    │
└──────────────────────────────┘
```

**User Message (Right-aligned):**
```
┌──────────────────────────────┐
│                           👤 │
│  ┌────────────────────────┐  │
│  │ Add buy groceries      │  │
│  │ to my list             │  │
│  └────────────────────────┘  │
│                    10:22 AM  │
└──────────────────────────────┘
```

#### Pookie Message Specification

**Container:**
- Display: Flex, align-start
- Margin: `mb-4`
- Max width: `80%` (mobile), `60%` (desktop)
- Align: Left

**Avatar:**
- Size: `32px` circle
- Background: Lavender gradient
- Content: 🐰 emoji or Pookie illustration
- Margin right: `mr-3`
- Border: `border-2 border-white`
- Shadow: `shadow-sm`

**Bubble:**
- Background: Glass (`bg-white/80 backdrop-blur-md`)
- Border: `border border-white/60`
- Border radius: `rounded-2xl rounded-tl-sm` (speech bubble)
- Padding: `p-4`
- Shadow: `shadow-md`
- Color: `neutral-900`
- Font: 16px, line-height 1.5

**Timestamp:**
- Font: 12px
- Color: `neutral-400`
- Margin top: `mt-1`
- Margin left: `ml-11` (aligns with bubble)

**Emoji:**
- Size: 20px inline with text
- Spacing: Slight margin around

#### User Message Specification

**Container:**
- Display: Flex, align-end, justify-end
- Margin: `mb-4`
- Max width: `80%` (mobile), `60%` (desktop)
- Align: Right

**Avatar:**
- Size: `32px` circle
- Background: User initial or photo
- Background color: `lavender-500`
- Text: White, uppercase initial
- Margin left: `ml-3`
- Border: `border-2 border-white`
- Shadow: `shadow-sm`

**Bubble:**
- Background: Primary gradient (`lavender-500` to `mint-500`)
- Border: None
- Border radius: `rounded-2xl rounded-tr-sm`
- Padding: `p-4`
- Shadow: `shadow-lg shadow-lavender/30`
- Color: `white`
- Font: 16px, font-medium, line-height 1.5

**Timestamp:**
- Font: 12px
- Color: `neutral-400`
- Margin top: `mt-1`
- Margin right: `mr-11`
- Text align: Right

#### Special Message Types

**Typing Indicator:**
```
┌─────────────────┐
│ 🐰              │
│  ┌───────────┐  │
│  │ ⚫⚫⚫     │  │ (animated)
│  └───────────┘  │
└─────────────────┘
```
- Dots: 3 circles, 8px each
- Animation: Bounce up/down, staggered (0ms, 150ms, 300ms delay)
- Color: `neutral-400`
- Duration: 0.6s ease-in-out infinite

**Action Button Message:**
```
┌────────────────────────────┐
│ 🐰                         │
│  ┌──────────────────────┐  │
│  │ Great! What priority?│  │
│  ├──────────────────────┤  │
│  │ [🔴 High]            │  │
│  │ [🟠 Medium]          │  │
│  │ [🟢 Low]             │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```
- Buttons: Full width within bubble
- Gap: `gap-2`
- Button style: Glass with hover effect

**Task Preview Card:**
```
┌────────────────────────────┐
│ 🐰                         │
│  ┌──────────────────────┐  │
│  │ I've added:          │  │
│  ├──────────────────────┤  │
│  │ ☐ Buy groceries      │  │
│  │   Due: Tomorrow      │  │
│  │   #shopping          │  │
│  └──────────────────────┘  │
└────────────────────────────┘
```
- Mini task card embedded in message
- Interactive: Click to view full task

#### Animations

**Message Entrance:**
```javascript
// Pookie message (from left)
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.3, ease: 'easeOut' }}

// User message (from right)
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.3, ease: 'easeOut' }}
```

**Typing Indicator Animation:**
```javascript
const dotVariants = {
  initial: { y: 0 },
  animate: {
    y: [-4, 0, -4],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

<motion.div variants={dotVariants} custom={0} />
<motion.div variants={dotVariants} custom={1} />
<motion.div variants={dotVariants} custom={2} />
```

---

### Component 5: Tag Chip

#### Visual Design
```
[#shopping]  [#work]  [#personal]
```

#### Specification

**Container:**
- Display: Inline-flex, align-center
- Padding: `px-3 py-1`
- Border radius: `rounded-full`
- Font: 13px, font-medium
- Gap: `gap-1.5` (if removable)
- Cursor: pointer (if interactive)

**Color Variants:**

**Shopping (Mint):**
```css
background: #DBFFF0    /* mint-100 */
color: #00846A         /* mint-700 */
border: 1px solid #B8FFE3  /* mint-200 */
```

**Work (Lavender):**
```css
background: #F3EFFF    /* lavender-100 */
color: #7640E0         /* lavender-700 */
border: 1px solid #E6DBFF  /* lavender-200 */
```

**Personal (Peach):**
```css
background: #FFE9DC    /* peach-100 */
color: #CC5500
border: 1px solid #FFD4C2  /* peach-200 */
```

**Urgent (Rose):**
```css
background: #FFE3E9    /* rose-100 */
color: #CC1155
border: 1px solid #FFC9D6  /* rose-200 */
```

**Hash Symbol:**
- Display: `#` prefix
- Color: Inherit
- Font weight: Same as text

**Remove Button (Optional):**
- Display: `×` character or close icon
- Size: 16px
- Color: Inherit with 70% opacity
- Hover: 100% opacity, scale 1.2
- Click: Remove tag with fade-out animation

**States:**

**Default:**
```css
opacity: 1
scale: 1
```

**Hover (if clickable):**
```css
transform: scale(1.05)
filter: brightness(0.95)
```

**Active (clicking):**
```css
transform: scale(0.95)
```

#### Animations

**Tag Entrance:**
```javascript
initial={{ opacity: 0, scale: 0.8 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ type: 'spring', stiffness: 400, damping: 20 }}
```

**Tag Removal:**
```javascript
exit={{ opacity: 0, scale: 0.8 }}
transition={{ duration: 0.2 }}
```

---

### Component 6: Add Task Modal

#### Visual Design
```
┌─────────────────────────────────────┐
│                                     │
│         Add New Task ✨             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ What do you need to do?     │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Priority:                          │
│  ○ High   ● Medium   ○ Low         │
│                                     │
│  Due Date:                          │
│  ┌─────────────────────────────┐   │
│  │ Tomorrow at 6:00 PM      📅│   │
│  └─────────────────────────────┘   │
│                                     │
│  Tags:                              │
│  [#shopping] [#personal] [+ Add]    │
│                                     │
│  [Cancel]           [Create Task]   │
│                                     │
└─────────────────────────────────────┘
```

#### Specification

**Backdrop:**
- Background: `bg-neutral-900/60`
- Backdrop filter: `blur(8px)`
- Click to close modal

**Modal Container:**
- Max width: `560px`
- Background: Glass (`bg-white/95 backdrop-blur-2xl`)
- Border: `border border-white/60`
- Border radius: `rounded-3xl`
- Padding: `p-8`
- Shadow: `shadow-2xl`
- Position: Center of screen

**Header:**
- Text: "Add New Task ✨"
- Font: 24px, font-semibold
- Color: `neutral-900`
- Margin bottom: `mb-6`
- Text align: Center

**Close Button:**
- Position: Absolute top-right
- Icon: × (24px)
- Style: Ghost button, rounded-full
- Size: 40x40px
- Hover: `bg-neutral-100`

**Description Input:**
- Label: "What do you need to do?"
- Font: 14px, font-medium, `neutral-700`
- Margin bottom: `mb-2`

**Input Field:**
- Type: Textarea, auto-resize
- Placeholder: "e.g., Buy groceries for dinner"
- Background: `bg-white`
- Border: `border-2 border-neutral-200`
- Focus border: `border-lavender-500`
- Border radius: `rounded-xl`
- Padding: `p-4`
- Min height: `80px`
- Font: 16px

**Priority Section:**
- Label: "Priority:"
- Font: 14px, font-medium
- Margin top: `mt-6`, margin bottom: `mb-3`

**Priority Radio Group:**
- Display: Flex, gap-4
- Options: High, Medium (default), Low
- Style: Custom radio buttons with colored indicators

**Priority Option:**
```
○ High
● Medium (selected)
○ Low
```
- Radio: 20px circle
- Border: `border-2`
- Selected: Filled with color, white check
- Label: Font 15px, margin-left 8px
- Colors: Rose (high), Peach (medium), Mint (low)

**Due Date Section:**
- Label: "Due Date:"
- Font: 14px, font-medium
- Margin top: `mt-6`, margin bottom: `mb-3`

**Date Picker Input:**
- Background: `bg-white`
- Border: `border-2 border-neutral-200`
- Focus border: `border-lavender-500`
- Border radius: `rounded-xl`
- Padding: `p-4`
- Icon: 📅 (right side)
- Placeholder: "Select date and time"

**Tags Section:**
- Label: "Tags:"
- Font: 14px, font-medium
- Margin top: `mt-6`, margin bottom: `mb-3`

**Tag List:**
- Display: Flex, flex-wrap
- Gap: `gap-2`
- Existing tags: Chip style with remove button
- Add button: Outlined chip, dashed border

**Footer:**
- Margin top: `mt-8`
- Display: Flex, justify-between
- Gap: `gap-4`

**Cancel Button:**
- Style: Secondary (ghost)
- Text: "Cancel"
- Padding: `py-3 px-6`
- Border radius: `rounded-xl`

**Create Button:**
- Style: Primary gradient
- Text: "Create Task"
- Padding: `py-3 px-8`
- Border radius: `rounded-xl`
- Disabled: Opacity 50% if description empty

#### Animations

**Modal Entrance:**
```javascript
// Backdrop
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}

// Modal
initial={{ opacity: 0, scale: 0.95, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
```

**Modal Exit:**
```javascript
exit={{ opacity: 0, scale: 0.95, y: 20 }}
transition={{ duration: 0.2 }}
```

**Input Focus:**
```javascript
whileFocus={{ scale: 1.01 }}
```

---

## Animation & Transitions

### Page Transitions

**Route Changes:**
```javascript
// Outgoing page
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.2 }}

// Incoming page
initial={{ opacity: 0, x: 20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.3, ease: 'easeOut' }}
```

**Sidebar Toggle (Mobile):**
```javascript
// Sidebar
variants={{
  open: { x: 0 },
  closed: { x: '-100%' }
}}
transition={{ type: 'spring', stiffness: 300, damping: 30 }}
```

### List Animations

**Task List Stagger:**
```javascript
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

<motion.div variants={container} initial="hidden" animate="show">
  {tasks.map(task => (
    <motion.div key={task.id} variants={item}>
      <TaskCard task={task} />
    </motion.div>
  ))}
</motion.div>
```

### Micro-interactions

**Button Hover:**
```javascript
whileHover={{
  scale: 1.05,
  transition: { duration: 0.2 }
}}
whileTap={{ scale: 0.95 }}
```

**Checkbox Check:**
```javascript
// Path animation for checkmark
initial={{ pathLength: 0, opacity: 0 }}
animate={{ pathLength: 1, opacity: 1 }}
transition={{ duration: 0.3, ease: 'easeInOut' }}
```

**Tag Add:**
```javascript
initial={{ opacity: 0, scale: 0, rotate: -10 }}
animate={{ opacity: 1, scale: 1, rotate: 0 }}
transition={{ type: 'spring', stiffness: 500, damping: 25 }}
```

**Notification Toast:**
```javascript
// Slide in from top
initial={{ opacity: 0, y: -50 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -50 }}
transition={{ type: 'spring', stiffness: 300, damping: 30 }}
```

### Celebration Animations

**Task Completion:**
```javascript
// Confetti burst
const confetti = Array.from({ length: 20 }).map((_, i) => ({
  x: Math.random() * 200 - 100,
  y: Math.random() * -150 - 50,
  rotate: Math.random() * 360,
  scale: Math.random() * 0.5 + 0.5,
  delay: i * 0.02
}));

// Each confetti piece
<motion.div
  initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
  animate={{
    x: confetti[i].x,
    y: confetti[i].y,
    opacity: 0,
    scale: confetti[i].scale,
    rotate: confetti[i].rotate
  }}
  transition={{ duration: 0.8, delay: confetti[i].delay }}
/>
```

**Streak Counter:**
```javascript
// Number count up
<motion.div
  initial={{ scale: 0.5, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
>
  {count}
</motion.div>
```

### Loading States

**Skeleton Shimmer:**
```javascript
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skeleton {
  background: linear-gradient(
    90deg,
    #E5E5E5 0%,
    #F5F5F5 50%,
    #E5E5E5 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

**Spinner:**
```javascript
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: 'linear'
  }}
>
  <CircleIcon />
</motion.div>
```

---

## AI Conversational Flows

### Flow 1: Add Task via Conversation

**User:** "Add buy groceries to my list"

**Pookie Response Sequence:**
```
Step 1 (Immediate):
[Pookie] "Got it! Adding 'buy groceries' 🛒"
         [Typing indicator: 0.5s]

Step 2 (Follow-up):
[Pookie] "✨ Added! Would you like to set a due date or priority?"

         Quick Actions:
         [Set due date] [Set priority] [All done!]
```

**If user clicks "Set due date":**
```
[Pookie] "When do you need to buy groceries? 📅"

         Quick Replies:
         [Today]
         [Tomorrow]
         [This Weekend]
         [Pick a date...]
```

**If user clicks "Tomorrow":**
```
[Pookie] "Perfect! Due tomorrow ✓

         Task Preview:
         ┌─────────────────────────┐
         │ ☐ Buy groceries         │
         │   Due: Tomorrow         │
         │   Priority: Medium      │
         └─────────────────────────┘

         You're all set! 🎯"
```

**Alternative - User provides everything upfront:**

**User:** "Add buy groceries tomorrow at 6pm high priority tagged shopping"

**Pookie:**
```
[Pookie] "Wow, you're specific! I love it 🎯

         Added:
         ┌─────────────────────────┐
         │ 🔴 ☐ Buy groceries      │
         │   Tomorrow at 6:00 PM   │
         │   #shopping             │
         └─────────────────────────┘

         Anything else?"
```

---

### Flow 2: Update Task - "Make this cute"

**User:** "Make this task cute and mark done"

**Pookie Intelligence:**
- Needs to know WHICH task
- Needs to interpret "make cute" (could mean: add emoji, change description)
- Needs to complete the task

**Pookie Response:**
```
[Pookie] "Which task should I make cute? 🎨"

         Shows list of recent tasks:
         1. Buy groceries
         2. Finish project report
         3. Call dentist

         Or type task name/number
```

**User:** "Number 1"

**Pookie:**
```
[Pookie] "Ooh, 'Buy groceries'! Let's make it adorable ✨

         How about: '🛒✨ Buy yummy groceries for dinner 🥕🥬'

         [Love it!] [Change emoji] [Nah, just mark done]"
```

**User:** "Love it!"

**Pookie:**
```
[Pookie] "Done! ✅ And marked complete!

         Updated task:
         ┌─────────────────────────────────────┐
         │ ☑ 🛒✨ Buy yummy groceries for      │
         │      dinner 🥕🥬                    │
         │   Completed just now                 │
         └─────────────────────────────────────┘

         You're amazing! 🎉"

         [Confetti animation plays]
```

---

### Flow 3: Bulk Move - "Move work todos to tomorrow evening"

**User:** "Move my work todos to tomorrow evening"

**Pookie Intelligence:**
- Filter tasks by #work tag
- Change due date to tomorrow evening (infer time: 6pm)
- Handle multiple tasks

**Pookie Response:**
```
[Pookie] "Found 3 tasks tagged #work 📋

         I'll move these to tomorrow at 6:00 PM:

         1. ☐ Finish project report
         2. ☐ Review pull requests
         3. ☐ Team standup prep

         Sound good?"

         [Yes, move them] [Show me first] [Cancel]
```

**User:** "Yes, move them"

**Pookie:**
```
[Pookie] "All done! 🎯

         Moved 3 tasks to tomorrow at 6:00 PM:
         ✓ Finish project report
         ✓ Review pull requests
         ✓ Team standup prep

         Tomorrow evening's looking busy! Want me to
         spread them out?"

         [Nope, all good] [Yes, spread them]
```

**Alternative - User picks "Yes, spread them":**
```
[Pookie] "Smart! How about:

         • Finish project report → Tomorrow 4:00 PM
         • Review pull requests → Tomorrow 6:00 PM
         • Team standup prep → Tomorrow 8:00 PM

         Better?"

         [Perfect!] [Let me adjust]
```

---

### Flow 4: Complex Query - "What's urgent today"

**User:** "What's urgent today?"

**Pookie Intelligence:**
- Filter: Due today + High priority
- Sort by due time
- Present in conversational format

**Pookie Response:**
```
[Pookie] "You have 2 urgent tasks today! 🔥

         ┌────────────────────────────────────┐
         │ 🔴 ☐ Client presentation           │
         │      Due: Today at 2:00 PM (2h)    │
         │      #work                          │
         ├────────────────────────────────────┤
         │ 🔴 ☐ Submit expense report          │
         │      Due: Today at 5:00 PM (5h)    │
         │      #admin                         │
         └────────────────────────────────────┘

         You got this! Want me to send you a reminder?"

         [Yes, remind me] [No thanks]
```

---

### Flow 5: Encouragement & Analytics

**User:** "Show my stats"

**Pookie Response:**
```
[Pookie] "Let's see how you're doing! 📊

         This Week:
         ✅ 12 tasks completed
         📝 8 tasks remaining
         🔥 60% completion rate
         ⚡ 3-day streak!

         You're crushing it! 💪

         Most productive day: Wednesday (5 tasks! 🎉)

         [View detailed stats] [Keep going!]"
```

**If user has completed 0 tasks:**
```
[Pookie] "No tasks completed yet, but that's okay! 🌱

         Everyone starts somewhere. Want to tackle
         your first task together?

         [Show my tasks] [Add a new task]"
```

**If user completes 5th task in a row:**
```
[Pookie] "🎉🎉🎉 FIVE IN A ROW! 🎉🎉🎉

         You're on FIRE today! 🔥

         [Animated celebration with confetti]

         Keep this momentum going! 💪✨"
```

---

### Flow 6: Natural Language Understanding Examples

#### Example 1: Time Parsing

**User:** "Remind me to call mom next Friday evening"

**Pookie Understanding:**
- Action: Create task
- Description: "Call mom"
- Due: Next Friday (calculates date)
- Time: Evening (defaults to 6:00 PM)
- Reminder: Implied (sets notification)

**Pookie:**
```
"Got it! I'll remind you to call mom 💕

 Due: Friday, Jan 10 at 6:00 PM
 Reminder set for 5:30 PM

 [Looks good!] [Change time]"
```

#### Example 2: Priority Inference

**User:** "Add URGENT: fix production bug"

**Pookie Understanding:**
- "URGENT" keyword → High priority
- Description: "fix production bug"
- Tag inference: #bug (from "bug"), #work (from "production")

**Pookie:**
```
"On it! Adding as HIGH priority 🔴

 Task:
 ☐ Fix production bug
 Priority: High
 Tags: #bug #work

 Need this done by a certain time?"
```

#### Example 3: Batch Operations

**User:** "Delete all my shopping tasks"

**Pookie Understanding:**
- Action: Delete
- Filter: Tag = #shopping
- Scope: All matching tasks
- Destructive action: Needs confirmation

**Pookie:**
```
"Whoa! That's 4 tasks tagged #shopping 🛒

 Are you sure you want to delete:
 • Buy groceries
 • Get birthday gift
 • Shopping mall trip
 • Return package

 [Yes, delete all] [Nevermind]"
```

#### Example 4: Smart Scheduling

**User:** "Schedule my dentist appointment for next available weekday morning"

**Pookie Understanding:**
- Action: Create task
- Description: "Dentist appointment"
- Constraint: Weekday (Mon-Fri)
- Time: Morning (default 9:00 AM)
- "Next available": Checks existing tasks, finds gap

**Pookie:**
```
"I checked your schedule! 📅

 Next available weekday morning is:
 Tuesday, Jan 7 at 9:00 AM

 (You have no conflicts that day!)

 [Schedule it] [Pick different time]"
```

#### Example 5: Context Awareness

**Conversation History:**
```
User: "What's on my agenda tomorrow?"
Pookie: [Shows 3 tasks]

User: "Move the second one to Wednesday"
Pookie: [Knows "second one" = Task #2 from previous response]
       "Moving 'Review pull requests' to Wednesday! ✓"
```

#### Example 6: Emoji & Personality Matching

**User:** "Add task: 🎉 Plan birthday party 🎂"

**Pookie Understanding:**
- Preserves user's emojis in description
- Matches energy with extra enthusiasm

**Pookie:**
```
"YESSS! Party time! 🎉🎂✨

 Added:
 ☐ 🎉 Plan birthday party 🎂

 When's the big day? Want me to help with
 party planning tasks?

 [Set party date] [Add sub-tasks] [I'm good!]"
```

---

## Responsive Behavior

### Breakpoint Strategy

```typescript
const breakpoints = {
  mobile: '0px',      // 0-639px
  tablet: '640px',    // 640-1023px
  desktop: '1024px',  // 1024px+
  wide: '1440px',     // 1440px+ (optional enhancement)
};
```

### Mobile (0-639px)

**Layout Changes:**
- Single column layout
- Sidebar becomes drawer (slides in from left)
- Chat panel slides up from bottom
- Navigation bar sticky at top
- Add button sticky at bottom

**Touch Interactions:**
- Swipe left on task → Show actions (Edit/Delete)
- Swipe right on task → Mark complete
- Long press task → Open context menu
- Pull down to refresh
- Swipe down on chat → Close panel

**UI Adjustments:**
- Font sizes: -2px from desktop
- Button height: Minimum 44px (touch target)
- Card padding: 16px (vs 24px desktop)
- Modal: Full screen or 90% height
- Navigation: Bottom tab bar (optional)

**Example Mobile Task Card:**
```css
.task-card-mobile {
  padding: 16px;
  border-radius: 16px;  /* vs 24px desktop */
  margin: 0 16px 12px 16px;
  touch-action: pan-y;  /* Enable vertical scroll */
}
```

### Tablet (640-1023px)

**Layout Changes:**
- Two-column: Sidebar (240px) + Main content
- Chat panel: Side panel (320px) instead of bottom
- Cards in 2-column grid (optional)

**UI Adjustments:**
- Sidebar width: 240px (vs 280px desktop)
- Font sizes: -1px from desktop
- Modal: 80% width, max 600px
- Touch targets: Still 44px minimum

### Desktop (1024px+)

**Layout:**
- Three zones: Sidebar (280px) + Main + Chat (optional)
- Hover states enabled
- Keyboard shortcuts active
- Mouse interactions optimized

**Enhancements:**
- Tooltips on hover (hidden on mobile)
- Context menus on right-click
- Drag-and-drop for reordering
- Hover previews
- Cursor-based interactions

### Orientation Changes

**Portrait → Landscape (Mobile):**
```javascript
useEffect(() => {
  const handleOrientationChange = () => {
    if (window.matchMedia('(orientation: landscape)').matches) {
      // Landscape mode: Reduce chat panel height
      setChatPanelHeight('40vh');
    } else {
      // Portrait mode: Standard height
      setChatPanelHeight('60vh');
    }
  };

  window.addEventListener('orientationchange', handleOrientationChange);
  return () => window.removeEventListener('orientationchange', handleOrientationChange);
}, []);
```

### Responsive Images/Icons

**Icon Sizes:**
```typescript
const iconSizes = {
  mobile: {
    small: 16,
    medium: 20,
    large: 28,
  },
  desktop: {
    small: 20,
    medium: 24,
    large: 32,
  },
};
```

**Pookie Avatar:**
- Mobile: 32px in messages, 40px in header
- Desktop: 40px in messages, 48px in header

### Reduced Motion

**Media Query:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**React Implementation:**
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const animationProps = prefersReducedMotion
  ? {}
  : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    };

<motion.div {...animationProps}>
  {children}
</motion.div>
```

---

## Acceptance Criteria

### AC-1: UI Design System
- [ ] Color palette matches specification (lavender, mint, peach, rose)
- [ ] All gradients render correctly
- [ ] Typography scale consistent (Inter/Cal Sans fonts loaded)
- [ ] Spacing system follows 4px baseline grid
- [ ] Border radius consistent (8-24px range)
- [ ] Glassmorphism effect renders on all glass components
- [ ] Shadows render with correct blur and opacity

### AC-2: Pages Implementation
- [ ] Login page renders with Pookie illustration
- [ ] Login animations sequence correctly
- [ ] Dashboard layout matches desktop/mobile specs
- [ ] Sidebar renders with navigation and stats
- [ ] Chat panel expands/collapses smoothly
- [ ] All routes navigate correctly

### AC-3: Component Library
- [ ] Task card displays all elements (checkbox, title, due date, tags, priority)
- [ ] Task card hover state works (desktop)
- [ ] Task card swipe actions work (mobile)
- [ ] Priority badge renders with correct colors
- [ ] Toggle button animates smoothly
- [ ] Chat bubbles align correctly (left/right)
- [ ] Typing indicator animates
- [ ] Tag chips render with proper colors
- [ ] Add task modal opens/closes with animation

### AC-4: Animations & Transitions
- [ ] Page transitions smooth (200-300ms)
- [ ] Task list staggers on load
- [ ] Button hover/tap feedback works
- [ ] Checkbox checkmark draws in
- [ ] Confetti plays on task completion
- [ ] Modal entrance/exit animates
- [ ] Reduced motion preference respected
- [ ] No jank (60fps maintained)

### AC-5: AI Conversational Flows
- [ ] "Add task" command understood and executed
- [ ] "Make cute and mark done" flow works
- [ ] "Move work todos to tomorrow" bulk operation works
- [ ] Priority inference from keywords (URGENT → High)
- [ ] Time parsing (tomorrow, next Friday, etc.)
- [ ] Context awareness (referencing previous messages)
- [ ] Confirmation required for destructive actions
- [ ] Pookie personality consistent (warm, encouraging)

### AC-6: Natural Language Commands
- [ ] "Add buy groceries tomorrow" creates task correctly
- [ ] "Make this task cute and mark done" executes multi-step
- [ ] "Move my work todos to tomorrow evening" moves filtered tasks
- [ ] "What's urgent today?" filters and displays
- [ ] "Delete all shopping tasks" prompts confirmation
- [ ] Emoji in commands preserved
- [ ] Invalid commands handled gracefully
- [ ] Ambiguous commands prompt clarification

### AC-7: Responsive Behavior
- [ ] Mobile layout (0-639px) renders correctly
- [ ] Tablet layout (640-1023px) renders correctly
- [ ] Desktop layout (1024px+) renders correctly
- [ ] Touch targets ≥44px on mobile
- [ ] Swipe gestures work on mobile
- [ ] Sidebar drawer slides in/out smoothly
- [ ] Chat panel responsive to screen size
- [ ] Orientation change handled
- [ ] No horizontal scroll on any breakpoint

### AC-8: Accessibility
- [ ] Keyboard navigation works for all interactions
- [ ] Focus indicators visible (lavender ring)
- [ ] Screen reader labels present (ARIA)
- [ ] Color contrast ≥4.5:1 (text), ≥3:1 (UI)
- [ ] Reduced motion preference supported
- [ ] Semantic HTML used throughout
- [ ] Form inputs have labels
- [ ] Error messages announced to screen readers
- [ ] Skip to main content link present

### AC-9: User Experience
- [ ] Empty states helpful and friendly
- [ ] Error messages clear and actionable
- [ ] Loading states present during async operations
- [ ] Success feedback for all actions
- [ ] No unexpected page jumps
- [ ] Forms validate on submit
- [ ] Inline validation for inputs
- [ ] Pookie responses feel conversational

### AC-10: Performance
- [ ] First Contentful Paint <1.5s
- [ ] Time to Interactive <3s
- [ ] Lighthouse Performance score ≥90
- [ ] Lighthouse Accessibility score ≥95
- [ ] No layout shift (CLS <0.1)
- [ ] Images optimized (WebP with fallback)
- [ ] Fonts loaded with fallback
- [ ] Bundle size <500KB gzipped

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 3.0-Complete | 2025-12-31 | Human Architect | Complete Phase III UI/UX specification |

---

## Approval

**Specification Status:** Ready for Implementation

**Next Steps:**
1. Human reviews and approves complete UI/UX specification
2. Set up Next.js project with Tailwind & Framer Motion
3. Hand off to Claude Code for frontend implementation
4. Claude Code generates all components from specs
5. Test all conversational flows
6. Human reviews implementation
7. Deploy and launch

---

**Document Owner:** Human UI/UX Architect
**Implementation Owner:** Claude Code (frontend generation)
**Backend Integration:** FastAPI (from SPEC-PHASE-III.md)
**Governed By:** CONSTITUTION.md v1.0.0, UI-CONSTITUTION.md v3.0-UI

---

**Remember:** This is Pookie's world - cute, delightful, intelligent, and always encouraging. Every pixel, every animation, every word matters. ✨🐰
