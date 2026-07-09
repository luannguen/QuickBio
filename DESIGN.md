# DESIGN.md - QuickBio Design Tokens

This document specifies the design tokens, color strategy, and UI rules for QuickBio frontend assets.

## Color System
We adhere to a **Restrained / Committed** color strategy. Backgrounds are deep dark neutrals, and the primary brand accent is used selectively (≤15% of the screen) to guide user focus.

### OKLCH-equivalent Theme Palette
- **Deep Background:** `oklch(12% 0.005 240)` - Tinted dark neutral (equivalent to `#080b11`) to prevent flat black eye strain.
- **Card Background:** `oklch(18% 0.008 240 / 0.4)` - Semi-transparent cards with elevation and fine borders (equivalent to `rgba(255,255,255,0.03)`).
- **Brand Accent (Coral):** `oklch(64% 0.201 32)` - High-contrast coral orange (equivalent to `#FF6B35`). Used for primary call-to-actions (CTAs), highlights, and active status indicators.
- **Secondary Accent (Electric Blue):** `oklch(60% 0.16 250)` - High-contrast electric blue for orders, links, and transactions (equivalent to `#3b82f6`).
- **Text Primary:** `oklch(96% 0.002 240)` - Crisp off-white (equivalent to `#f3f4f6`).
- **Text Secondary:** `oklch(70% 0.005 240)` - Muted grey (equivalent to `#9ca3af`) for labels, descriptions, and supporting info.

## Typography
- **Primary Typeface:** Inter, Outfit, or system-ui sans-serif.
- **Line Length Constraints:** Main reading columns capped at `68ch` to minimize eye movement.
- **Visual Hierarchy:** Accentuated weight contrasts (e.g., Bold `700` titles vs Medium `500` descriptions).

## Layout & Motion rules
- **Touch Targets:** Interactive targets must be at least `44px` tall and wide for mobile-first friendliness.
- **Card Usage:** Avoid generic layouts. Cards are used only for group listings (e.g., product collection, transaction list). Nesting cards is prohibited.
- **Transitions:** All hover, active, and scale effects use `transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). No bounce.
