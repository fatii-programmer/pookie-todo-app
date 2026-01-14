# Evolution of Todo - UI/UX Constitution (Phase III)

**Version:** 3.0-UI
**Date:** 2025-12-31
**Status:** Governing Document
**Applies To:** Frontend Development (Phase III+)
**Governed By:** CONSTITUTION.md v1.0.0

---

## Vision Statement

### The "Pookie" Philosophy

This application embodies the **"pookie" aesthetic** - a design philosophy that combines:
- **Cuteness without infantilization** - Friendly and approachable, yet professional
- **Joy in functionality** - Every interaction should spark delight
- **Calm intelligence** - AI assistance feels natural, not intrusive
- **Soft power** - Gentle visual design with powerful capabilities

**Inspiration:**
- Netflix's UI polish and responsiveness
- Apple's attention to micro-interactions
- Linear's keyboard-first design
- Duolingo's friendly personality
- Stripe's glassmorphism and gradients

**Goal:** Create a todo application so beautiful and delightful that users *want* to organize their tasks.

---

## Core Principles

### 1. Spec-Driven UI Development

**Principle:** All UI components, layouts, and interactions must be defined in detailed specifications before implementation. Claude Code generates 100% of the frontend code from these specifications.

**Why:**
- Ensures consistency across the application
- Prevents ad-hoc design decisions
- Enables systematic design evolution
- Maintains design system integrity
- Facilitates AI-driven code generation

**Human Responsibilities:**
- Write detailed UI/UX specifications
- Define component APIs and props
- Specify interaction behaviors
- Define animation timings and curves
- Review generated code against specs

**Claude Code Responsibilities:**
- Generate all React/Next.js components
- Implement all Tailwind CSS styling
- Create all Framer Motion animations
- Build responsive layouts
- Ensure accessibility compliance

**Forbidden:**
- Humans writing CSS classes manually
- Humans creating JSX components
- Humans implementing animations
- "Quick fixes" outside of spec process
- Copy-pasting components from other projects

---

### 2. AI-Native Conversational Experience

**Principle:** The entire interface is designed around natural conversation with an AI assistant, not traditional form filling.

**Core Concept:**
```
Traditional UI:  User → Form → Submit → Result
Pookie UI:       User ←→ AI Conversation ←→ Actions
```

**Design Implications:**
- Chat interface is the primary interaction surface
- Forms appear only when AI needs structured input
- Confirmations feel conversational, not modal-heavy
- System feedback mimics human conversation
- Voice-first design (future: voice input)

**AI Personality:**
- Name: "Pookie" (the AI assistant)
- Tone: Warm, encouraging, slightly playful
- Style: Brief, helpful, occasionally cute
- Behavior: Anticipates needs, never patronizing

**Example Conversation:**
```
User: "I need to prep for the big meeting"
Pookie: "Got it! I've added 'Prep for big meeting' 🎯
         When's the meeting?"
User: "Tomorrow at 2pm"
Pookie: "Perfect! Due tomorrow at 2pm ✨
         Want me to set it as high priority?"
```

---

### 3. Glassmorphism & Soft Aesthetics

**Principle:** Visual design uses glassmorphic elements, soft shadows, and subtle gradients to create depth without harshness.

**Visual Language:**
- **Glass panels** - Frosted glass effect for cards and containers
- **Soft shadows** - Multiple layered shadows for depth
- **Subtle gradients** - Pastel color transitions
- **Rounded corners** - 12-24px border radius (never sharp)
- **Gentle animations** - Ease-in-out curves, no jarring motion

**Material Hierarchy:**
```
Background Layer:    Soft gradient (lavender → mint)
Surface Layer:       Frosted glass cards (backdrop-blur)
Interactive Layer:   Slightly elevated glass (hover state)
Floating Layer:      Modals, tooltips (strong blur + shadow)
```

**Depth Creation:**
- Layered shadows (not single harsh shadow)
- Backdrop blur intensity (16px - 24px)
- Subtle scale transforms on hover
- Gradient overlays for emphasis

---

### 4. Mobile-First Responsive Design

**Principle:** Design for mobile screens first, enhance for larger screens. Touch-friendly interactions always.

**Breakpoints:**
```css
mobile:  0px - 639px    (default, primary design)
tablet:  640px - 1023px  (enhanced layout)
desktop: 1024px+         (full feature set)
```

**Mobile Priorities:**
- Thumb-reachable zones (bottom 60% of screen)
- Minimum touch target: 44x44px
- Single-column layouts
- Collapsible navigation
- Swipe gestures for common actions

**Desktop Enhancements:**
- Two/three-column layouts
- Hover states (but not required for functionality)
- Keyboard shortcuts
- Sidebar always visible
- Drag-and-drop (optional enhancement)

---

### 5. Accessibility as Foundation

**Principle:** Every user, regardless of ability, can use every feature. Accessibility is not optional.

**WCAG 2.1 AA Compliance Required:**
- Color contrast ratio ≥ 4.5:1 (text)
- Color contrast ratio ≥ 3:1 (UI components)
- Keyboard navigation for all interactions
- Screen reader compatibility
- Focus indicators visible and clear
- No reliance on color alone

**Implementation Requirements:**
- Semantic HTML always
- ARIA labels where needed
- Focus management for modals/dialogs
- Skip links for navigation
- Alt text for all images/icons
- Reduced motion support (`prefers-reduced-motion`)

---

## Design System

### Color Palette

#### Primary Colors (Pastel Palette)

**Lavender** (Primary brand color)
```
lavender-50:  #FAF8FF  (backgrounds)
lavender-100: #F3EFFF  (hover states)
lavender-200: #E6DBFF
lavender-300: #D4C2FF  (accents)
lavender-400: #C1A3FF
lavender-500: #A87EFF  (primary actions)
lavender-600: #8F5CFF
lavender-700: #7640E0
```

**Mint** (Success, calm actions)
```
mint-50:  #F0FFF9
mint-100: #DBFFF0
mint-200: #B8FFE3
mint-300: #8FFFD4  (success states)
mint-400: #5EFFC4
mint-500: #2DFFB3
mint-600: #00E699
```

**Peach** (Warnings, important)
```
peach-50:  #FFF8F5
peach-100: #FFE9DC
peach-200: #FFD4C2
peach-300: #FFBDA3  (warning states)
peach-400: #FFA684
peach-500: #FF8E64
```

**Rose** (Errors, urgent)
```
rose-50:  #FFF5F7
rose-100: #FFE3E9
rose-200: #FFC9D6
rose-300: #FFADC2  (error states)
rose-400: #FF8FAC
rose-500: #FF6B96
```

**Neutral** (Text, backgrounds)
```
neutral-50:  #FAFAFA  (white equivalent)
neutral-100: #F5F5F5  (backgrounds)
neutral-200: #E5E5E5
neutral-300: #D4D4D4
neutral-500: #737373  (secondary text)
neutral-700: #404040  (primary text)
neutral-900: #171717  (headings)
```

#### Gradients

**Background Gradient (Default):**
```css
bg-gradient-to-br from-lavender-50 via-mint-50 to-peach-50
```

**Card Overlay Gradient:**
```css
bg-gradient-to-br from-white/40 to-white/10
```

**Accent Gradient (CTAs):**
```css
bg-gradient-to-r from-lavender-500 to-mint-500
```

---

### Typography

**Font Families:**
```css
Font Family (Primary):  'Inter Variable', sans-serif
Font Family (Display):  'Cal Sans', 'Inter Variable', sans-serif
Font Family (Mono):     'JetBrains Mono', monospace
```

**Type Scale:**
```
text-xs:    12px / 16px  (captions, labels)
text-sm:    14px / 20px  (body small, secondary)
text-base:  16px / 24px  (body primary)
text-lg:    18px / 28px  (emphasized text)
text-xl:    20px / 28px  (small headings)
text-2xl:   24px / 32px  (section headings)
text-3xl:   30px / 36px  (page headings)
text-4xl:   36px / 40px  (hero headings)
```

**Font Weights:**
```
font-normal:    400  (body text)
font-medium:    500  (buttons, emphasized)
font-semibold:  600  (headings, important)
font-bold:      700  (rare, special emphasis)
```

**Line Heights:**
- Body text: `leading-relaxed` (1.625)
- Headings: `leading-tight` (1.25)
- UI elements: `leading-none` (1)

---

### Spacing & Rhythm

**Spacing Scale (Tailwind):**
```
0.5 → 2px   (tight spacing)
1   → 4px   (minimal)
2   → 8px   (compact)
3   → 12px  (default)
4   → 16px  (comfortable)
6   → 24px  (spacious)
8   → 32px  (section dividers)
12  → 48px  (major sections)
16  → 64px  (page margins)
```

**Rhythm Rules:**
- Card padding: `p-6` (24px)
- Section gaps: `gap-8` (32px)
- Component spacing: `space-y-4` (16px between)
- Page margins: `px-4 md:px-8 lg:px-16`

---

### Border Radius

**Curvature Scale:**
```
rounded-sm:   4px   (minimal rounding, rare)
rounded:      8px   (small components)
rounded-lg:   12px  (cards, default)
rounded-xl:   16px  (panels, emphasized)
rounded-2xl:  20px  (large surfaces)
rounded-3xl:  24px  (hero elements)
rounded-full: 9999px (pills, avatars)
```

**Usage Guidelines:**
- Small buttons: `rounded-lg`
- Cards: `rounded-xl`
- Modals: `rounded-2xl`
- Input fields: `rounded-lg`
- Pills/badges: `rounded-full`

---

### Shadows & Elevation

**Shadow Hierarchy:**

**Shadow SM** (subtle depth)
```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
Use: Input fields, small cards
```

**Shadow MD** (default elevation)
```css
shadow-md:
  0 4px 6px -1px rgb(0 0 0 / 0.1),
  0 2px 4px -2px rgb(0 0 0 / 0.1)
Use: Cards, dropdowns
```

**Shadow LG** (prominent elements)
```css
shadow-lg:
  0 10px 15px -3px rgb(0 0 0 / 0.1),
  0 4px 6px -4px rgb(0 0 0 / 0.1)
Use: Modals, floating panels
```

**Shadow XL** (floating UI)
```css
shadow-xl:
  0 20px 25px -5px rgb(0 0 0 / 0.1),
  0 8px 10px -6px rgb(0 0 0 / 0.1)
Use: Tooltips, popovers
```

**Colored Shadows** (on hover)
```css
shadow-lavender: 0 8px 16px -2px rgb(168 126 255 / 0.3)
shadow-mint:     0 8px 16px -2px rgb(45 255 179 / 0.3)
```

---

### Glassmorphism Implementation

**Glass Effect Standard:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
}
```

**Intensity Levels:**

**Light Glass** (subtle)
```css
bg-white/60 backdrop-blur-sm border border-white/20
```

**Medium Glass** (default)
```css
bg-white/70 backdrop-blur-md border border-white/30
```

**Strong Glass** (modals)
```css
bg-white/80 backdrop-blur-xl border border-white/40
```

**Dark Glass** (inverted)
```css
bg-neutral-900/70 backdrop-blur-lg border border-white/10
```

---

## Component Library

### Core Components

#### 1. Chat Message Bubble

**Specification:**
- User messages: Right-aligned, lavender gradient
- AI (Pookie) messages: Left-aligned, glass effect
- Typing indicator: Animated dots
- Timestamps: Subtle, appear on hover
- Avatar: Pookie icon (AI), user initial (User)

**Props Interface:**
```typescript
interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  showAvatar?: boolean;
}
```

**Visual Requirements:**
- Max width: 80% on mobile, 60% on desktop
- Padding: `p-4`
- Border radius: `rounded-2xl`
- Shadow: `shadow-md` on user, `shadow-sm` on AI
- Animation: Slide in from bottom + fade in

---

#### 2. Task Card

**Specification:**
- Glass card with priority color accent
- Checkbox: Animated checkmark
- Description: Truncated with expand on click
- Tags: Pill-shaped, pastel colors
- Due date: Icon + relative time
- Priority: Colored dot indicator

**Props Interface:**
```typescript
interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isExpanded?: boolean;
}
```

**States:**
- Default: Glass card, `scale-100`
- Hover: Lift up (`scale-105`), stronger shadow
- Checked: Strikethrough, opacity 60%
- Editing: Border glow, focused state

**Priority Indicators:**
- High: Rose dot + rose accent border
- Medium: Peach dot + peach accent
- Low: Mint dot + mint accent

---

#### 3. Input Field (Conversational)

**Specification:**
- Large, friendly input at bottom of screen
- Auto-resize as user types
- Send button: Gradient, rounded-full
- Voice input button (future)
- Suggestions appear above input

**Props Interface:**
```typescript
interface ConversationalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  isLoading?: boolean;
  suggestions?: string[];
}
```

**Visual Requirements:**
- Background: `bg-white/80 backdrop-blur-lg`
- Border: `border-2 border-lavender-200` (focus: `border-lavender-500`)
- Padding: `p-4`
- Min height: `64px`
- Max height: `200px` (scrollable beyond)

---

#### 4. Button Variants

**Primary Button:**
```css
Gradient background: lavender → mint
Text: white, font-semibold
Padding: py-3 px-6
Border radius: rounded-xl
Shadow: shadow-lg + shadow-lavender on hover
Transform: scale-105 on hover
```

**Secondary Button:**
```css
Background: glass effect
Text: lavender-700
Border: border-2 border-lavender-300
Padding: py-3 px-6
Border radius: rounded-xl
Hover: bg-lavender-50
```

**Ghost Button:**
```css
Background: transparent
Text: neutral-700
Padding: py-2 px-4
Border radius: rounded-lg
Hover: bg-neutral-100
```

**Icon Button:**
```css
Size: 40x40px (touch-friendly)
Background: glass effect
Border radius: rounded-full
Hover: scale-110, shadow
Icon size: 20x20px
```

---

#### 5. Modal/Dialog

**Specification:**
- Center of screen, max-width 600px
- Glass background with strong blur
- Backdrop: Dark overlay (60% opacity)
- Close button: Top-right, rounded-full
- Animation: Scale + fade in from 95%

**Props Interface:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}
```

**Visual Requirements:**
- Background: `bg-white/90 backdrop-blur-xl`
- Padding: `p-8`
- Border radius: `rounded-3xl`
- Shadow: `shadow-2xl`
- Backdrop: `bg-neutral-900/60`

---

#### 6. Tag/Chip

**Specification:**
- Pill-shaped, pastel background
- Small text, semibold
- Optional remove icon
- Hover: Slight scale up

**Props Interface:**
```typescript
interface TagProps {
  label: string;
  color?: 'lavender' | 'mint' | 'peach' | 'rose';
  onRemove?: () => void;
  size?: 'sm' | 'md';
}
```

**Visual Requirements:**
- Background: `bg-{color}-100`
- Text: `text-{color}-700`
- Padding: `px-3 py-1` (sm), `px-4 py-2` (md)
- Border radius: `rounded-full`
- Font size: `text-xs` (sm), `text-sm` (md)

---

#### 7. Loading States

**Skeleton Loader:**
```css
Background: linear shimmer animation
Colors: neutral-200 → neutral-100 → neutral-200
Border radius: matches component (rounded-xl)
Animation: 1.5s ease-in-out infinite
```

**Spinner:**
```css
Size: 24px (sm), 40px (md), 64px (lg)
Color: lavender-500
Animation: Smooth rotation
Style: Circular, gradient stroke
```

**Typing Indicator (Pookie typing):**
```css
Three dots, bouncing animation
Color: neutral-400
Delay: 0ms, 150ms, 300ms
Animation: 0.6s ease-in-out infinite
```

---

### Animation Principles

#### Motion Guidelines

**Timing Functions:**
```javascript
easeInOut:   [0.4, 0, 0.2, 1]     // Default, smooth
easeOut:     [0, 0, 0.2, 1]       // Entering elements
easeIn:      [0.4, 0, 1, 1]       // Exiting elements
spring:      {type: "spring", stiffness: 300, damping: 30}
```

**Duration Standards:**
```javascript
fast:    150ms   // Micro-interactions (hover, focus)
base:    300ms   // Standard transitions (fade, slide)
slow:    500ms   // Complex animations (modal, page)
slower:  800ms   // Emphasis animations (success, error)
```

**Animation Types:**

**Fade In:**
```javascript
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}
```

**Slide Up:**
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
```

**Scale Pop:**
```javascript
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
transition={{ type: "spring", stiffness: 300, damping: 30 }}
```

**Stagger Children:**
```javascript
variants={{
  container: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
}}
```

#### Reduced Motion

**Always Respect `prefers-reduced-motion`:**
```javascript
const prefersReducedMotion = useReducedMotion();

const variants = prefersReducedMotion ?
  { initial: {}, animate: {} } :
  { initial: { opacity: 0 }, animate: { opacity: 1 } };
```

---

## Interaction Patterns

### Conversational Interaction Flow

**User Journey:**
```
1. User lands → Pookie greets
   "Hey there! 👋 What would you like to do today?"

2. User types → Input expands, suggestions appear
   Suggestions: "Add a task", "Show my tasks", "What's due today?"

3. User sends → Message bubble animates in
   Pookie typing indicator appears

4. Pookie responds → Response bubbles slide in
   With action buttons if applicable

5. Action happens → Visual feedback
   Checkmark animation, confetti (optional), sound (optional)

6. Confirmation → Brief, friendly
   "Done! ✨", "Got it! 🎯", "All set! 💫"
```

### Micro-interactions

**Checkbox Toggle:**
```
Unchecked → Hover (scale 1.1) → Click → Checkmark draws in → Task fades
Duration: 400ms total
Sound: Soft "pop" (optional)
```

**Button Press:**
```
Idle → Hover (scale 1.05, shadow) → Active (scale 0.98) → Release → Action
Haptic feedback on mobile
```

**Tag Remove:**
```
Hover → X appears → Click → Tag shrinks + fades → Removed
Duration: 200ms
```

**Task Complete:**
```
Check → Strikethrough animates → Card opacity 60% → Slide to bottom (optional)
Celebration: Subtle confetti or sparkle
```

---

## Responsive Layouts

### Mobile Layout (0-639px)

**Structure:**
```
┌─────────────────────────┐
│  Header (sticky)        │  ← Logo + Menu button
├─────────────────────────┤
│                         │
│  Chat Messages          │  ← Scrollable, full width
│  (Conversation)         │
│                         │
├─────────────────────────┤
│  Input (sticky bottom)  │  ← Large, thumb-friendly
└─────────────────────────┘
```

**Priorities:**
- Single column always
- Bottom nav/input for thumb reach
- Swipe gestures (back, refresh)
- Collapsible filters/settings
- Large touch targets (min 44px)

---

### Tablet Layout (640-1023px)

**Structure:**
```
┌────────────────────────────────────┐
│  Header                            │
├──────────┬─────────────────────────┤
│  Sidebar │  Chat Messages          │
│  (Tasks) │  (Conversation)         │
│          │                         │
│          ├─────────────────────────┤
│          │  Input                  │
└──────────┴─────────────────────────┘
```

**Enhancements:**
- Two-column layout
- Sidebar shows task list
- More breathing room
- Hover states appear

---

### Desktop Layout (1024px+)

**Structure:**
```
┌────┬──────────┬─────────────────┬──────────┐
│Logo│  Search  │  Conversation   │Analytics │
├────┴──────────┼─────────────────┤(optional)│
│               │                 │          │
│  Task List    │  Chat Messages  │  Stats   │
│  Sidebar      │  (Conversation) │  Charts  │
│               │                 │          │
│  - All Tasks  │                 │          │
│  - Today      │                 │          │
│  - Upcoming   ├─────────────────┤          │
│  - Tags       │  Input          │          │
│               │                 │          │
└───────────────┴─────────────────┴──────────┘
```

**Enhancements:**
- Three-column layout
- Always-visible sidebar
- Analytics panel (optional)
- Keyboard shortcuts
- Drag-and-drop enabled

---

## Accessibility Requirements

### Keyboard Navigation

**Required Shortcuts:**
```
/          Focus search/input
Escape     Close modal/dialog
Tab        Navigate focusable elements
Enter      Submit/confirm
Space      Toggle checkbox
Arrow keys Navigate lists
Cmd/Ctrl+K Quick command palette
```

**Focus Management:**
- Visible focus indicators (2px lavender-500 ring)
- Logical tab order
- Focus trap in modals
- Skip to main content link
- Restore focus after modal close

---

### Screen Reader Support

**ARIA Labels Required:**
```html
<!-- Buttons without text -->
<button aria-label="Send message">
  <SendIcon />
</button>

<!-- Status updates -->
<div role="status" aria-live="polite">
  Task added successfully
</div>

<!-- Loading states -->
<div role="status" aria-live="polite" aria-busy="true">
  Loading tasks...
</div>
```

**Semantic HTML:**
- `<main>` for primary content
- `<nav>` for navigation
- `<article>` for task cards
- `<button>` for clickable actions (never `<div onclick>`)
- `<form>` for input submission

---

### Color & Contrast

**Contrast Requirements:**
- Body text: 4.5:1 minimum
- Headings (large text): 3:1 minimum
- UI components: 3:1 minimum
- Icons: 3:1 minimum

**Color Independence:**
- Never rely on color alone for information
- Use icons + text for status
- Pattern/texture in addition to color
- High contrast mode support

---

### Motion & Animation

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Implementation:**
```javascript
const shouldReduceMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<motion.div
  animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
/>
```

---

## AI Interaction Design Boundaries

### Pookie's Personality

**Voice & Tone:**
- Warm, encouraging, slightly playful
- Uses emoji sparingly (1-2 per message)
- Celebrates wins ("Great job! 🎉", "You got this! 💪")
- Gentle with errors ("No worries, let's try again")
- Never condescending or robotic

**Communication Style:**
```
✅ DO:
"I've added 'Buy groceries' to your list! 🛒 Want to set a reminder?"
"You're on fire today! 5 tasks completed 🔥"
"Looks like you have 3 tasks due tomorrow. Should I show them?"

❌ DON'T:
"Task successfully created in database with ID 1234."
"Your task has been added to the queue for processing."
"Error: Invalid input. Please try again."
```

**Response Length:**
- Keep responses under 3 lines on mobile
- Use progressive disclosure for long content
- Offer "Tell me more" buttons for details

---

### Conversation Patterns

**Greeting (First time):**
```
Pookie: "Hey! 👋 I'm Pookie, your friendly task assistant.
         I'm here to help you stay organized.
         What would you like to do first?"

Buttons: [Add a task] [Show my tasks] [Learn more]
```

**Greeting (Returning user):**
```
Pookie: "Welcome back! ✨ You have 3 tasks for today.
         Want to see them?"

Buttons: [Show tasks] [Add new task] [All done for now]
```

**Clarification:**
```
User: "Add meeting"
Pookie: "Got it! When's the meeting? 📅"

Quick replies: [Today] [Tomorrow] [This week] [Custom...]
```

**Confirmation:**
```
User: "Delete all my tasks"
Pookie: "Whoa, that's a big step! 😮
         This will delete all 15 of your tasks.
         Are you absolutely sure?"

Buttons: [Yes, delete all] [Nevermind]
```

**Error Handling:**
```
Pookie: "Hmm, I didn't quite catch that. 🤔
         Could you rephrase? Or try one of these:

         • Add a task
         • Show today's tasks
         • Update a task"
```

---

### Progressive Disclosure

**Principle:** Show only what's needed, hide complexity until requested.

**Examples:**

**Task List - Collapsed:**
```
┌─────────────────────────────┐
│ ☐ Buy groceries             │
│   Due: Tomorrow · High      │
└─────────────────────────────┘
```

**Task List - Expanded:**
```
┌─────────────────────────────┐
│ ☐ Buy groceries             │
│   Due: Tomorrow at 2:00 PM  │
│   Priority: High 🔴         │
│   Tags: #shopping #personal │
│   Created: 2 days ago       │
│                             │
│   [Edit] [Delete] [Share]  │
└─────────────────────────────┘
```

**Settings - Layered:**
```
Level 1: Basic settings (theme, notifications)
Level 2: Advanced settings (data export, API)
Level 3: Developer settings (webhooks, integrations)
```

---

## Component Consistency Rules

### Naming Conventions

**Component Names:**
```
PascalCase for components:  TaskCard, MessageBubble, PriorityBadge
camelCase for utilities:    formatDate, calculatePriority
kebab-case for files:       task-card.tsx, message-bubble.tsx
```

**Props Naming:**
```
Event handlers:   onToggle, onClick, onSubmit
Boolean props:    isLoading, hasError, isExpanded
Content props:    title, description, children
Data props:       task, user, session
```

---

### Component Structure

**Standard Template:**
```typescript
// 1. Imports
import { motion } from 'framer-motion';
import type { Task } from '@/types';

// 2. Props Interface
interface TaskCardProps {
  task: Task;
  onToggle: () => void;
  isExpanded?: boolean;
}

// 3. Component
export function TaskCard({ task, onToggle, isExpanded = false }: TaskCardProps) {
  // 4. Hooks
  const [isHovered, setIsHovered] = useState(false);

  // 5. Derived state
  const priorityColor = getPriorityColor(task.priority);

  // 6. Event handlers
  const handleToggle = () => {
    onToggle();
  };

  // 7. Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="..."
    >
      {/* Component content */}
    </motion.div>
  );
}
```

---

### Prop Defaults

**Standard Defaults:**
```typescript
interface ComponentProps {
  size?: 'sm' | 'md' | 'lg';        // default: 'md'
  variant?: 'primary' | 'secondary'; // default: 'primary'
  isLoading?: boolean;               // default: false
  isDisabled?: boolean;              // default: false
  className?: string;                // default: ''
}
```

**Destructuring with Defaults:**
```typescript
export function Button({
  size = 'md',
  variant = 'primary',
  isLoading = false,
  isDisabled = false,
  className = '',
  children
}: ButtonProps) {
  // ...
}
```

---

### State Management

**Local State (useState):**
- Component-specific UI state (hover, focus, expanded)
- Temporary input values
- Animation states

**Global State (Context/Zustand):**
- User session
- Task list
- UI preferences (theme, sidebar collapsed)
- Chat history

**Server State (React Query):**
- Tasks from API
- User profile
- Analytics data

---

## Implementation Governance

### Code Generation Rules

**Claude Code Must:**
1. Generate complete, production-ready components
2. Include all specified animations
3. Implement accessibility features
4. Add proper TypeScript types
5. Follow Tailwind CSS conventions
6. Include JSDoc comments
7. Handle error states
8. Support dark mode (if specified)

**Claude Code Must NOT:**
1. Use arbitrary CSS values (only Tailwind classes)
2. Hardcode colors (use design tokens)
3. Skip accessibility attributes
4. Use `any` type in TypeScript
5. Create components without props interface
6. Omit loading/error states
7. Use deprecated React patterns

---

### Review Criteria

**UI Specification Review (Human):**
- [ ] Design mockups provided or described in detail
- [ ] All states specified (default, hover, active, disabled, loading, error)
- [ ] Animation timings and curves defined
- [ ] Responsive behavior documented
- [ ] Accessibility requirements listed
- [ ] Color contrast verified
- [ ] Touch target sizes confirmed

**Implementation Review (Human):**
- [ ] Generated code matches specification
- [ ] All Tailwind classes from design system
- [ ] No arbitrary values used
- [ ] Animations smooth and performant
- [ ] Accessibility attributes present
- [ ] TypeScript types complete
- [ ] Component reusable and composable

---

### Testing Requirements

**Visual Regression:**
- Screenshot tests for all components
- Test all states (hover, focus, active, disabled)
- Test all breakpoints (mobile, tablet, desktop)
- Test dark mode if implemented

**Accessibility Testing:**
- Lighthouse audit score ≥95
- axe DevTools: 0 violations
- Keyboard navigation verified
- Screen reader tested (VoiceOver/NVDA)
- Color contrast validated

**Animation Testing:**
- No jank (60fps maintained)
- Reduced motion respected
- Animation duration within spec
- Stagger timing correct

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.0-UI | 2025-12-31 | Initial UI/UX Constitution for Phase III |

---

## Approval & Amendments

**Specification Status:** Governing Document

**Amendment Process:**
1. Propose change with detailed rationale
2. Impact assessment (components affected, timeline)
3. Review by design lead (human)
4. Update this constitution
5. Regenerate affected components

**Breaking Changes:**
- Major version bump (4.0-UI, 5.0-UI)
- Migration guide required
- Backwards compatibility plan
- Staged rollout

---

## Appendix: Quick Reference

### Tailwind Config Extensions

**Custom Colors:**
```javascript
colors: {
  lavender: { /* 50-700 */ },
  mint: { /* 50-600 */ },
  peach: { /* 50-500 */ },
  rose: { /* 50-500 */ }
}
```

**Custom Shadows:**
```javascript
boxShadow: {
  'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  'lavender': '0 8px 16px -2px rgba(168, 126, 255, 0.3)',
  'mint': '0 8px 16px -2px rgba(45, 255, 179, 0.3)'
}
```

**Custom Animations:**
```javascript
animation: {
  'shimmer': 'shimmer 1.5s ease-in-out infinite',
  'bounce-subtle': 'bounce 0.6s ease-in-out infinite'
}
```

---

**Document Owner:** Human UI/UX Architect
**Implementation Owner:** Claude Code
**Governed By:** CONSTITUTION.md v1.0.0
**Applies To:** Frontend (Phase III and beyond)

---

**Remember:** Every pixel matters. Every animation delights. Every interaction respects the user. This is the Pookie way. ✨
