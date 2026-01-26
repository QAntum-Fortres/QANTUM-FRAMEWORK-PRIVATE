## PALETTE'S JOURNAL
This journal tracks CRITICAL UX/accessibility learnings.

Format: `## YYYY-MM-DD - [Title]`
`**Learning:** [UX/a11y insight]`
`**Action:** [How to apply next time]`

## 2025-02-27 - Clipboard Robustness
**Learning:** The `navigator.clipboard` API is frequently restricted in strict security contexts (like `file://` or non-HTTPS), causing copy features to fail silently or throw errors.
**Action:** Always include a `document.execCommand('copy')` fallback within a `try-catch` block for copy-to-clipboard interactions, even in modern applications, to ensure reliability across all environments.
