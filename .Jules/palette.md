# PALETTE'S JOURNAL - CRITICAL LEARNINGS ONLY

## 2026-01-21 - Decorative ASCII Art & Misleading Affordances
**Learning:** Large ASCII art blocks in this project's documentation/dashboards are major screen reader traps if not hidden.
**Action:** Always wrap decorative ASCII art in `aria-hidden="true"` containers. Also, avoid `cursor: pointer` on non-interactive dashboard cards to prevent user frustration.
