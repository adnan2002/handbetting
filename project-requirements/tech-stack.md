# Tech Stack Recommendation — Hand Betting Game

## Stack Summary

| Layer            | Choice                                        |
| ---------------- | --------------------------------------------- |
| Framework        | React 19 + Vite                               |
| Language         | TypeScript (strict)                           |
| Routing          | React Router v7                               |
| State Management | Zustand (game state) + React local state (UI) |
| Styling          | Tailwind CSS v4                               |
| Animations       | Framer Motion                                 |
| Persistence      | LocalStorage (leaderboard scores)             |
| Testing          | Vitest + React Testing Library                |

---

## Key Decisions and Rationale

### React + Vite over Next.js

This is a purely client-side game. There are no SEO concerns, no server-rendered pages, and no API routes to serve. Next.js would introduce SSR hydration complexity, a Node server, and file-system routing conventions that provide zero value here.

Vite provides:

- Sub-second HMR during development.
- Optimized production builds via Rollup.
- First-class TypeScript and JSX support with no configuration.

### Zustand for State Management

The game carries deeply interconnected state across a single session:

- **Draw Pile** and **Discard Pile** (arrays of tiles, counts displayed in the UI).
- **Current Hand** (drawn tiles with computed total value).
- **Individual Tile Values** — each Dragon and Wind tile tracks its own mutable value (starts at 5, adjusted by +1/−1 on win/loss). This is *per-tile*, not per-type.
- **Bet History** and **Score**.
- **Reshuffle Count** (game ends on the 3rd exhaustion).
- **Game Phase** (betting, revealing, game-over).

Zustand is the right fit because:

1. **Single store, sliced by concern** — one `gameStore` holds all game state, but logic is organized into slices (deck, hand, scoring). Adding a new slice for a future feature is a single file addition.
2. **No boilerplate** — unlike Redux Toolkit, there are no action types, reducers, or dispatch calls. State updates are plain functions.
3. **Middleware** — the `persist` middleware can snapshot game state to LocalStorage for mid-session recovery with one line of configuration.
4. **Subscriptions** — components subscribe to exactly the slices they need, preventing unnecessary re-renders during animations.

### Tailwind CSS v4

Polish is listed as a *major* evaluation factor. Tailwind enables:

- Rapid, consistent styling through utility classes.
- A design-token system via CSS variables (colors, spacing, typography) that keeps the visual language coherent.
- Easy dark-mode support if desired (a single `dark:` prefix).
- No CSS file bloat — unused utilities are purged at build time.

### Framer Motion

Smooth animations are non-negotiable for a game that revolves around revealing tiles and displaying results. Framer Motion provides:

- **`AnimatePresence`** — handles enter/exit animations for mounting and unmounting components (hand history sliding out, score summary fading in).
- **`layout` prop** — automatically animates positional changes when tile lists reorder.
- **`variants` with `staggerChildren`** — creates staggered tile-deal effects without manual delay management.
- **Spring physics** — gives tile movements a natural, satisfying feel.

### LocalStorage for Leaderboard

The specification asks for a top-5 high-score leaderboard. There is no mention of authentication, user accounts, or shared/global scores. LocalStorage is the simplest solution that satisfies the requirement.

To preserve scalability, the leaderboard is accessed through a repository interface (see below). Swapping LocalStorage for a REST API or IndexedDB requires implementing a single interface — no component or store code changes.

### TypeScript (strict mode)

Strict TypeScript is essential for:

- Modeling tile categories as **discriminated unions**, giving exhaustive `switch` checking at compile time.
- Catching invalid state transitions (e.g., betting when the game is over).
- Making the codebase self-documenting for the onsite reviewer.

`tsconfig.json` should enable `strict: true`, `noUncheckedIndexedAccess: true`, and `exactOptionalPropertyTypes: true`.

---

## Project Structure

```
src/
├── components/           Reusable UI primitives
│   ├── TileCard.tsx        Single tile with flip/reveal animation
│   ├── Button.tsx          Styled button variants
│   └── ScoreBadge.tsx      Animated score display
│
├── features/             Feature-scoped pages and compositions
│   ├── landing/
│   │   ├── LandingPage.tsx
│   │   └── Leaderboard.tsx
│   ├── game/
│   │   ├── GameBoard.tsx       Main game layout
│   │   ├── BettingControls.tsx Higher / Lower buttons
│   │   ├── HandDisplay.tsx     Current hand tiles + total
│   │   └── HistoryView.tsx     Previous hand (smaller tiles)
│   └── summary/
│       └── ScoreSummary.tsx    End-of-game score screen
│
├── stores/               Zustand stores
│   ├── gameStore.ts        Deck, hand, bets, score, phase
│   └── leaderboardStore.ts Top scores via repository
│
├── models/               Pure logic — no React, no side effects
│   ├── tile.ts             Tile types, deck generation, shuffle
│   ├── scoring.ts          Value calculation, win/loss adjustments
│   └── game.ts             Game-over conditions, reshuffle rules
│
├── hooks/                Custom React hooks
│   ├── useGame.ts          Orchestrates game actions
│   ├── useDeck.ts          Deck draw/reshuffle helpers
│   └── useLeaderboard.ts   Read/write leaderboard scores
│
├── lib/                  Utilities and constants
│   ├── constants.ts        Magic numbers, config
│   └── utils.ts            Shuffle, random, formatting
│
└── assets/               Static resources
    └── tiles/              Tile SVGs or images
```

The `models/` directory is deliberately framework-agnostic. All game logic lives here as pure functions and types, making it trivially testable and reusable if the UI framework ever changes.

---

## Core Type Modeling

### Tiles

```typescript
type NumberTile = {
  category: "number";
  value: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
};

type DragonTile = {
  category: "dragon";
  name: "red" | "green" | "white";
};

type WindTile = {
  category: "wind";
  name: "east" | "south" | "west" | "north";
};

type Tile = NumberTile | DragonTile | WindTile;
```

Discriminated unions on the `category` field allow exhaustive `switch` handling. Adding a new tile category (e.g., Seasons, Flowers) during the onsite is a single type addition — the compiler flags every `switch` that needs updating.

### Tile Instance (runtime, with mutable value)

```typescript
type TileInstance = {
  id: string;          // unique per physical tile in the deck
  tile: Tile;
  currentValue: number; // number tiles: face value (immutable); dragons/winds: starts at 5
};
```

Each `TileInstance` carries its own `currentValue`, satisfying the requirement that non-number tile values are tracked *per individual tile*.

### Game Phase

```typescript
type GamePhase =
  | { phase: "betting" }
  | { phase: "revealing"; bet: "higher" | "lower" }
  | { phase: "gameOver"; reason: "tileValueBoundary" | "deckExhausted" };
```

Modeling the phase as a discriminated union prevents invalid state combinations (e.g., accessing the bet direction before a bet is placed).

---

## Persistence Abstraction

```typescript
interface ScoreRepository {
  getTopScores(limit: number): Promise<Score[]>;
  saveScore(score: Score): Promise<void>;
}
```

The initial implementation is `LocalStorageScoreRepository`. The `Promise` return types future-proof the interface for async backends. Swapping to a REST API during the onsite requires only a new class — no changes to components, hooks, or stores.

---

## Animations Plan

| Moment             | Technique                                                  |
| ------------------- | ---------------------------------------------------------- |
| Tile deal           | Staggered slide-in from deck position (`staggerChildren`)  |
| Tile reveal         | 3D Y-axis flip via `rotateY` transform                     |
| Bet result feedback | Color flash (green/red) + scale pulse on the score display |
| Hand to history     | `AnimatePresence` exit: slide-left and shrink               |
| Score summary       | Count-up number animation on final score                   |
| Page transitions    | Fade + slide via `AnimatePresence` on route changes         |

---

## No-Backend Justification

The specification does not require authentication, multiplayer, or shared/global state. Introducing a backend would:

- Add deployment complexity (hosting, CORS, environment variables).
- Consume timeline budget that is better spent on polish and extensibility.
- Provide no user-facing benefit for this scope.

The repository pattern ensures a backend can be integrated in under an hour if requested during the onsite interview. The Zustand `persist` middleware can also be pointed at a server-synced adapter with no store refactoring.
