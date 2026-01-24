## 2025-05-23 - ASCII Art & Native Dialogs
**Learning:** ASCII art used for decoration creates a severe accessibility barrier for screen reader users as every character is announced.
**Action:** Always wrap ASCII art containers with `role="img"` and provide a meaningful `aria-label`.

**Learning:** Native browser `alert()` and `confirm()` block the main thread and break the visual immersion of the application.
**Action:** Replace blocking alerts with the native HTML `<dialog>` element, which supports `::backdrop` styling for glassmorphism and maintains keyboard accessibility.

## 2024-05-23 - Developer Experience (DX)
**Learning:** Developers and security auditors frequently need to copy tokens and configs. Select-copy-paste is error-prone.
**Action:** Always provide a "Copy to Clipboard" button for code blocks, with a fallback for non-secure contexts to ensure reliability (Enterprise Grade).
