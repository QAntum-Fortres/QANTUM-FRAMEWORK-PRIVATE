## PALETTE'S JOURNAL
This journal tracks CRITICAL UX/accessibility learnings.

Format: `## YYYY-MM-DD - [Title]`
`**Learning:** [UX/a11y insight]`
`**Action:** [How to apply next time]`

## 2026-01-26 - Micro-Interactions and Stability
**Learning:** Loading states on actions (like "Simulate Healing") significantly improve perceived performance and prevent user uncertainty. Also, guarding against missing DOM elements (like missing canvases) is crucial for preventing script crashes that break unrelated interactions.
**Action:** Always verify if an element exists before accessing its context or properties, and provide immediate visual feedback for async actions.
