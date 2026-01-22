## 2024-05-23 - ASCII Art & Native Dialogs
**Learning:** ASCII art used for decoration creates a severe accessibility barrier for screen reader users as every character is announced.
**Action:** Always wrap ASCII art containers with `role="img"` and provide a meaningful `aria-label`.

**Learning:** Native browser `alert()` and `confirm()` block the main thread and break the visual immersion of the application.
**Action:** Replace blocking alerts with the native HTML `<dialog>` element, which supports `::backdrop` styling for glassmorphism and maintains keyboard accessibility.
