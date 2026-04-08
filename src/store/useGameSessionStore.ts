// import { create } from 'zustand'
// import type { Tile } from '../types/tile'
// import type { BetDirection, GameSession } from '../types/game'
// import { createDeck, shuffleDeck, MAX_RESHUFFLES } from '../constants/tiles'

// type GameSessionActions = {
//     startGame: () => void
//     drawTile: () => void
//     placeBet: (direction: BetDirection) => void
//     resolveBet: () => void
//     reshuffle: () => void
//     resetGame: () => void
// }

// type GameSessionStore = GameSession & GameSessionActions

// function initialState(): GameSession {
//     return {
//         round: 1,
//         discardPile: [],
//         drawPile: [],
//         score: 0,
//         reshuffles: 0,
//         currentTile: null,
//         bet: null,
//     }
// }

// const useGameSessionStore = create<GameSessionStore>((set, get) => ({
//     ...initialState(),

//     startGame: () => {
//         const drawPile = createDeck()
//         set({ ...initialState(), drawPile })
//     },

//     drawTile: () => {
//         const { drawPile } = get()
//         if (drawPile.length === 0) return

//         const nextPile = [...drawPile]
//         const tile = nextPile.pop()!
//         set({ drawPile: nextPile, currentTile: tile, bet: null })
//     },

//     placeBet: (direction: BetDirection) => {
//         set({ bet: direction })
//     },

//     resolveBet: () => {
//         const { drawPile, currentTile, bet, score, discardPile, round } = get()
//         if (!currentTile || !bet || drawPile.length === 0) return

//         const nextPile = [...drawPile]
//         const nextTile = nextPile.pop()!

//         const currentValue = currentTile.value
//         const nextValue = nextTile.value

//         let won = false
//         if (bet === 'higher') {
//             won = nextValue > currentValue
//         } else {
//             won = nextValue < currentValue
//         }

//         const scoreChange = won ? nextValue : -nextValue

//         set({
//             drawPile: nextPile,
//             discardPile: [...discardPile, currentTile],
//             currentTile: nextTile,
//             score: score + scoreChange,
//             round: round + 1,
//             bet: null,
//         })
//     },

//     reshuffle: () => {
//         const { reshuffles, discardPile, drawPile } = get()
//         if (reshuffles >= MAX_RESHUFFLES || discardPile.length === 0) return

//         const combined = [...drawPile, ...discardPile]
//         set({
//             drawPile: shuffleDeck(combined),
//             discardPile: [],
//             reshuffles: reshuffles + 1,
//         })
//     },

//     resetGame: () => {
//         set(initialState())
//     },
// }))

// export default useGameSessionStore
