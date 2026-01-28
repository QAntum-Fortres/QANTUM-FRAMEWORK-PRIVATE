## PALETTE'S JOURNAL
This journal tracks CRITICAL UX/accessibility learnings.

Format: `## YYYY-MM-DD - [Title]`
`**Learning:** [UX/a11y insight]`
`**Action:** [How to apply next time]`

## 2026-01-26 - Micro-Interactions and Stability
**Learning:** Loading states on actions (like "Simulate Healing") significantly improve perceived performance and prevent user uncertainty. Also, guarding against missing DOM elements (like missing canvases) is crucial for preventing script crashes that break unrelated interactions.
**Action:** Always verify if an element exists before accessing its context or properties, and provide immediate visual feedback for async actions.

## 2026-01-28 - Destructive Action Confirmation
**Learning:** Users can easily trigger destructive actions (like "Emergency Purge") if they are simple buttons. A timed "double-tap" confirmation state is a lightweight, accessible pattern that prevents errors without using intrusive modals.
**Action:** Apply the timed reset confirmation pattern to all critical system actions (Reset, Purge, Delete).
