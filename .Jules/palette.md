## 2024-05-22 - Replacing Alerts with Native Dialogs
**Learning:** Native `alert()` calls disrupt the user flow and are often inaccessible or jarring. The `<dialog>` element provides a semantic, accessible, and customizable alternative that integrates seamlessly with modern glassmorphism designs.
**Action:** Always scan for `alert()` usage in frontend code and replace with `<dialog>.showModal()` for info/confirmation modals.
