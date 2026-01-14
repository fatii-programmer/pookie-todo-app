# Quick Start Guide

Get the Evolution of Todo Phase III UI up and running in under 5 minutes!

## Prerequisites

- Node.js 20 or higher
- npm, yarn, or pnpm

## Installation

```bash
# Navigate to the project
cd phase3-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What You'll See

1. **Login Page** (`/login`)
   - Beautiful animated welcome screen
   - Click either auth button to proceed

2. **Dashboard** (`/dashboard`)
   - 3 sample tasks to play with
   - Click the `+` button to add tasks
   - Toggle checkboxes to complete tasks
   - Hover over tasks to see edit/delete options

3. **Chat with Pookie**
   - Click the chat bar at the bottom
   - Type a message and press Enter
   - Pookie will respond with encouragement!

## Try These Features

### Task Management
- ✅ Click checkbox to mark complete (watch the animation!)
- 🎯 Create task with the `+` button
- 🏷️ Add tags (shopping, work, personal, urgent)
- 📅 Set due dates
- 🔴🟠🟢 Choose priority levels

### Navigation
- 📝 Click sidebar items (Today, Upcoming, Completed, All Tasks)
- 📊 View stats in the sidebar card
- ⚙️ Settings link (page not implemented yet)

### Chat Panel
- 💬 Click to expand/collapse
- 💭 Watch typing indicator
- 🐰 See Pookie's friendly responses

## Project Structure at a Glance

```
src/
├── app/
│   ├── dashboard/page.tsx    # Main dashboard
│   ├── login/page.tsx        # Login screen
│   └── globals.css           # Global styles
├── components/
│   ├── TaskCard.tsx          # Task display
│   ├── ChatPanel.tsx         # AI chat
│   ├── AddTaskModal.tsx      # Task creation
│   └── ...                   # Other components
├── store/
│   └── useAppStore.ts        # Zustand state
└── types/
    └── index.ts              # TypeScript types
```

## Key Technologies

- **Next.js 14**: React framework
- **Tailwind CSS**: Styling (custom Pookie palette!)
- **Framer Motion**: Smooth animations
- **Zustand**: State management
- **TypeScript**: Type safety

## Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
lavender: {
  500: '#A87EFF',  // Change this!
}
```

### Modify Mock Data
Edit `src/app/dashboard/page.tsx`:
```typescript
const mockTasks: Task[] = [
  // Add your tasks here
];
```

### Adjust Animations
Edit animation duration in components:
```typescript
transition={{ duration: 0.4 }}  // Make it faster/slower
```

## Common Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Tips

1. **Responsive**: Resize your browser to see mobile/tablet/desktop layouts
2. **Animations**: All animations respect `prefers-reduced-motion`
3. **Keyboard**: Try navigating with Tab and Enter
4. **State**: Refresh the page - your theme settings persist!

## What's Next?

- Read the full [README.md](./README.md)
- Check [CHANGELOG.md](./CHANGELOG.md) for all features
- Review [SPEC-PHASE-III-COMPLETE.md](../SPEC-PHASE-III-COMPLETE.md) for design specs
- Explore [UI-CONSTITUTION.md](../UI-CONSTITUTION.md) for design principles

## Need Help?

- All components are documented with TypeScript types
- Check `src/types/index.ts` for data structures
- Look at `src/components/` for implementation examples
- Animations use Framer Motion - see [framer.com/motion](https://www.framer.com/motion)

## Backend Integration (Coming Soon)

This UI is ready for backend integration:
- React Query hooks prepared
- API proxy routes ready
- FastAPI backend spec available
- OpenAI Agents SDK integration planned

---

**Happy coding! Remember: Keep it cute, keep it delightful! 🐰✨**
