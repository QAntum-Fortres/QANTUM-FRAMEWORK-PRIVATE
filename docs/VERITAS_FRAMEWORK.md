# Veritas Cognitive QA Framework (v1.0)

## Overview
Veritas is a "Post-Scriptum" QA framework designed to render legacy tools like Selenium, Cypress, and Playwright obsolete. It employs a **Zero-Wait Architecture**, **Vision-Based Neural Locators**, and **Goal-Oriented Autonomous Agents**.

## Core Architecture

### 1. Vision-Based Interface (The Eyes)
Veritas does not rely on fragile DOM selectors (IDs, XPaths, Classes). Instead, it uses a simulated **Vision-Transformer (ViT)** layer (`NeuralLocator`) to analyze screenshots in real-time.
- **Intent-Based Location:** You ask to find "Buy Button", and the ViT finds it based on visual features (shape, color, icon, context), just like a human.
- **Robustness:** UI refactors that change HTML structure but keep visual appearance do not break tests.

### 2. Semantic Healing (The Immune System)
When a selector *does* fail (e.g., in legacy mode), the **Semantic Healer** kicks in.
- **Embedding Comparison:** It compares the vector embedding of the missing element with current elements on the screen.
- **Auto-Recovery:** If a sufficiently similar element is found (e.g., `id="submit-v2"` instead of `id="submit"`), the test continues, and the "Neural Map" is updated.

### 3. Goal-Oriented Agents (The Brain)
Tests are no longer static scripts. They are goals.
- **Input:** "Verify that a user can complete a purchase with a 10% discount code."
- **Execution:** The agent autonomously navigates, identifies fields (Checkout, Coupon), inputs data, and generates assertions based on the state change (Price drop).

### 4. Zero-Wait Architecture (The Omega Layer)
Veritas hooks directly into the browser's rendering engine and network stack via the **StateChangeObserver**.
- **No `wait()`:** The framework only acts when the "Amniotic State" (Visual Stability + Network Idle) is achieved.
- **Faster Execution:** Eliminates arbitrary sleep times and flaky `waitFor` loops.

### 5. Distributed Swarm Execution
The framework allows spinning up thousands of micro-agents in a headless Rust-based container mesh (`DistributedSwarm`).
- **Global Testing:** Agents can be deployed to different regions (simulated) to test latency and localization.

## Tech Stack
- **Core:** Rust (`veritas_core`) - High performance, memory safety.
- **SDK:** TypeScript (`veritas-sdk`) - Developer-friendly API.
- **Protocol:** JSON-RPC over Standard I/O (SecureCommand).

## Usage
See `SDK_REFERENCE.md` for API details.
