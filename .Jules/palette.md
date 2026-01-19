# Palette's Journal

## 2024-05-22 - Mobile Accessibility Gaps
**Learning:** The mobile dashboard components (`StatCard`, `HealthRow`) are implemented as standard `View` components without accessibility traits. Screen readers will likely skip them or read them poorly.
**Action:** When building custom UI components in React Native, always include `accessible={true}` and meaningful `accessibilityLabel` props, especially for information cards.
