## PALETTE'S JOURNAL
This journal tracks CRITICAL UX/accessibility learnings.

Format: `## YYYY-MM-DD - [Title]`
`**Learning:** [UX/a11y insight]`
`**Action:** [How to apply next time]`

## 2026-01-26 - Micro-Interactions and Stability
**Learning:** Loading states on actions (like "Simulate Healing") significantly improve perceived performance and prevent user uncertainty. Also, guarding against missing DOM elements (like missing canvases) is crucial for preventing script crashes that break unrelated interactions.
**Action:** Always verify if an element exists before accessing its context or properties, and provide immediate visual feedback for async actions.

## 2026-01-29 - Persona-Based Theming
**Learning:** Users may require conflicting aesthetics (e.g., "Playful" vs "Serious"). Using CSS Variables + Class Toggles allows a single interface to serve multiple psychological needs (Gamification vs Professionalism) without code duplication or complete redesigns.
**Action:** When asked for a "variant" or "redesign", first consider if a Theme Toggle can solve the user's need while preserving the original design system.

## 2026-02-01 - Collapsible Navigation Accessibility
**Learning:** Collapsible sidebars that hide text labels can create a confusing experience for screen reader users if the remaining icons lack descriptive labels.
**Action:** Ensure navigation links retain their accessible names via `aria-label` even when the visible text label is removed from the DOM.
