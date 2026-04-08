# 🀄 Technical Assessment: Hand Betting Game

## Overview

Build a web-based **Hand Betting Game** using Mahjong tiles. This project evaluates your ability to handle **complex state management**, **UI polish**, and **code scalability**.

> **Important:** This project should be built with the future in mind. During the onsite interview, you will be asked to add new features or extend the existing logic. **Code readiness for extension is a primary evaluation factor.**

---

## Core Requirements & Acceptance Criteria

### 1. Landing Page

| Feature | Description |
|---|---|
| **New Game** | A clear entry point to start a session |
| **Leaderboard** | Displays the top 5 high scores |

---

### 2. Game Mechanics & Logic

#### Tile Set
Use the following Mahjong tile categories:
- **Dragons**
- **Winds**
- **Number Tiles** (1–9)

#### Tile Values

| Tile Type | Base Value | On Win | On Loss |
|---|---|---|---|
| Number Tiles | Face value | — | — |
| Dragons / Winds | 5 | +1 | −1 |

> Non-number tile values are **tile-specific** — each individual tile tracks its own value independently.

#### Deck Management

- Display the count of tiles in both the **Draw Pile** and the **Discard Pile**
- **Reshuffling:** When the Draw Pile is empty, combine a fresh deck with the Discard Pile and shuffle them into a new Draw Pile

#### Game Over Conditions

The game ends when **any** of the following occur:

1. Any single tile's value reaches **0** or **10**
2. The Draw Pile runs out of tiles for the **3rd time**

---

### 3. Gameplay Interface

#### Navigation
- A button to **exit the game** and return to the landing page

#### Betting Actions
- **Bet Higher** — wager that the next hand's total will be higher
- **Bet Lower** — wager that the next hand's total will be lower

#### Visual State
- Display the **current hand's total value** and visual tile representations
- Display a **History view** showing smaller versions of the previous hand's tiles and their values

#### End of Game
- A **score summary screen** displaying the player's final score

---

## Evaluation Criteria

### 🎨 Polish *(Major factor)*
High-quality CSS, smooth transitions, and an intuitive user experience.

### 🏗️ Scalability
Code must be **feature-ready** — architecture should allow for easy additions, which will be tested onsite.

### 🧹 Code Quality
Clean, modular, and well-documented code.

---

## Submission Instructions

| # | Requirement | Details |
|---|---|---|
| 1 | **Repository** | Link to a public GitHub repository |
| 2 | **Documentation** | `README.md` with setup instructions + a note on what was handwritten vs. where AI was used |
| 3 | **Video Walkthrough** | Short video demonstrating gameplay and your technical approach |
| 4 | **Timeline** | Submit within **4 days** |
