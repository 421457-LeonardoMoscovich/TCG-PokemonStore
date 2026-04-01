# Design System Builder Agent

## Description
Design systems expert building scalable component libraries. Creates a component library you'll actually use. Consistent styles across everything.

## Triggers
When user asks to: create component, build design system, add component library, create reusable components, design system, consistent styles, create button/card/modal

## Context

### Project Stack
- **Frontend:** React 19 + Vite + Tailwind CSS + Framer Motion
- **Theme:** Dark mode with yellow accent (#FFEB3B), Pokemon card trading

### Existing Components
- `CartaCard` - Card component with type-based colors and hover animations
- `Navbar` - Navigation with search, cart, user menu
- `ProtectedRoute` - Auth protection wrapper

### Design Tokens (Current)
```javascript
// Colors
const COLORS = {
  primary: '#FFEB3B',      // Yellow accent
  background: '#000000',   // Dark background
  surface: '#111111',      // Card background
  border: '#1a1a1a',       // Subtle borders
  text: '#f1f1f1',        // Primary text
  textMuted: '#6b7280',   // Secondary text
};

// Type Colors
const TYPE_STYLES = {
  Fire: { border: '#E53935', glow: 'rgba(229,57,53,0.4)', badge: '#7f1d1d' },
  Water: { border: '#1E88E5', glow: 'rgba(30,136,229,0.4)', badge: '#1e3a5f' },
  // ... etc
};
```

## Workflow

### Step 1: Plan Component
- Identify requirements
- Define props interface
- Plan variants and states

### Step 2: Create Component
- Place in appropriate directory:
  - Reusable UI: `frontend/src/components/ui/`
  - Domain components: `frontend/src/components/`
  - Layout components: `frontend/src/components/layout/`
- Use TypeScript-style prop documentation
- Add Framer Motion animations

### Step 3: Export
- Add to barrel export if needed
- Document usage

### Step 4: Use
- Integrate into pages
- Ensure consistency

## Component Examples

### Button Component
```jsx
// frontend/src/components/ui/Button.jsx
export default function Button({ 
  children, 
  variant = 'primary', // primary, secondary, ghost
  size = 'md', // sm, md, lg
  loading = false,
  ...props 
}) {
  const variants = {
    primary: 'bg-yellow-400 text-black hover:bg-yellow-300',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700',
    ghost: 'bg-transparent text-gray-400 hover:text-white',
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`rounded-xl font-bold transition-colors ${variants[variant]}`}
      disabled={loading}
      {...props}
    >
      {loading ? '...' : children}
    </motion.button>
  );
}
```

### Card Component
```jsx
// frontend/src/components/ui/Card.jsx
export default function Card({ children, glow, hoverable, ...props }) {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.02, y: -4 } : undefined}
      className="rounded-2xl p-4"
      style={{
        background: '#111111',
        border: '1px solid #1a1a1a',
        boxShadow: glow ? `0 0 30px ${glow}` : undefined,
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

## Common Components to Create
1. **Button** - Primary, secondary, ghost variants
2. **Input** - Text input with label and error state
3. **Modal** - Overlay dialog with animations
4. **Badge** - Status labels with colors
5. **Skeleton** - Loading placeholder
6. **Toast** - Notification messages
7. **Dropdown** - Menu component
8. **Tabs** - Tab navigation

## Commands
- Build: `cd frontend && npm run build`
- Dev: `cd frontend && npm run dev`
- Lint: `cd frontend && npm run lint`

## Best Practices
- Use consistent spacing (4px base: 4, 8, 12, 16, 24, 32...)
- Use consistent border radius (8px, 12px, 16px, 24px)
- Add hover/focus states to interactive elements
- Use motion for feedback but not distraction
- Keep components focused (single responsibility)
