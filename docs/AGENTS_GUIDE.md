# AGENTS GUIDE: GOAL-ORIENTED TESTING

## Philosophy
In Veritas, you do not write steps. You define **Goals**. The Agent figures out the steps.

## Defining Goals

Goals are natural language strings passed to the `GoalOrientedAgent`.

### Example 1: E-Commerce Flow
**Goal**: "Verify that a user can complete a purchase with a 10% discount code."

**Agent Execution**:
1.  **Exploration**: Agent scans the homepage, identifies "Shop" or product links.
2.  **Navigation**: Enters product page, adds to cart.
3.  **Checkout**: Identifies "Checkout" button via Neural Locator.
4.  **Discount**: Recognizes "Coupon" field visually. Inputs code.
5.  **Assertion**: Reads the "Total" price and calculates if it matches `Price * 0.9`.

### Example 2: Login Verification
**Goal**: "Ensure user cannot login with invalid credentials."

**Agent Execution**:
1.  Finds Login form.
2.  Inputs random garbage data.
3.  Clicks Login.
4.  Observes UI for "Error" message (Red text, Alert box).
5.  Asserts that "Dashboard" is NOT reached.

## JSON Interface
To execute a goal via the Rust Core:

```json
{
  "command": "Goal",
  "payload": {
    "goal": "Verify purchase with 10% discount"
  }
}
```

## Response Format
The agent returns a `GoalResult` containing the steps it took and the reasoning for each.

```json
{
  "success": true,
  "steps": [
    {
      "action": "Navigate to /checkout",
      "observation": "Found checkout page...",
      "reasoning": "Goal mentions 'discount'...",
      "duration_ms": 120
    },
    ...
  ],
  "audit_log_url": "s3://..."
}
```
