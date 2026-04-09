import type { GameSession, BetDirection } from '../types/game'
import type { Tile, DragonTile, WindTile } from '../types/tile'
import { createDrawPile, shufflePile, TILES_PER_HAND, MAX_RESHUFFLES, MIN_SCORE, resetTileValues, DRAGON_TILES, WIND_TILES } from '../constants/tiles'
import { setScoreEntry } from '../hooks/userLocalStorage'
import { create } from 'zustand'
import useGameStore from './useGameStore'


function initialState(): GameSession {
    return {
        round: 1,
        discardPile: [],
        drawPile: createDrawPile(),
        score: 0,
        date: new Date(),
        reshuffles: 0,
        currentHand: [],
        newHand: [],
        bet: null,
        gameOver: false,
        gameOverReason: null,
        pendingTileUpdate: null,
    }
}

function handValue(hand: Tile[]): number {
    return hand.reduce((sum, tile) => sum + tile.value, 0)
}

type GameSessionActions = {
    startGame: () => void
    placeBet: (direction: BetDirection) => void
    resolveBet: () => void
    reshuffle: () => void
    exitGame: () => void
    saveScore: () => void
    applyTileUpdate: () => void
    getSpecialCardValues: () => Array<DragonTile | WindTile>
}

type GameSessionStore = GameSession & GameSessionActions

const useGameSessionStore = create<GameSessionStore>((set, get) => ({
    ...initialState(),

    startGame: () => {
        resetTileValues()
        const state = initialState()
        const currentHand = state.drawPile.slice(0, TILES_PER_HAND)
        const drawPile = state.drawPile.slice(TILES_PER_HAND)
        set({ ...state, currentHand, drawPile })
    },

    placeBet: (direction: BetDirection) => {
        set({ bet: direction })
    },

    resolveBet: () => {
        const state = get()
        if (state.gameOver || !state.bet) return

        let { drawPile, discardPile, reshuffles } = state

        if (drawPile.length < TILES_PER_HAND) {
            reshuffles += 1
            if (reshuffles >= MAX_RESHUFFLES) {
                set({ gameOver: true, gameOverReason: 'max_reshuffles', reshuffles })
                return
            }
            const freshDeck = createDrawPile()
            drawPile = shufflePile([...freshDeck, ...discardPile])
            discardPile = []
        }

        const newHand = drawPile.slice(0, TILES_PER_HAND)
        drawPile = drawPile.slice(TILES_PER_HAND)

        const currentVal = handValue(state.currentHand)
        const newVal = handValue(newHand)

        let scoreDelta = 0
        const isTie = newVal === currentVal
        const betCorrect =
            (state.bet === 'higher' && newVal > currentVal) ||
            (state.bet === 'lower' && newVal < currentVal)

        if (!isTie) {
            scoreDelta = betCorrect ? 1 : -1
        }

        const pendingTileUpdate = isTie ? null : {
            betCorrect,
            tiles: state.currentHand.filter(t => t.category !== 'number'),
        }
        const newScore = Math.max(MIN_SCORE, state.score + scoreDelta)

        const delta = betCorrect ? 1 : -1
        const wouldHitTileLimit = !isTie && state.currentHand.some(
            t => t.category !== 'number' && (t.value + delta <= 0 || t.value + delta >= 10)
        )

        if (wouldHitTileLimit) {
            set({
                newHand,
                drawPile,
                discardPile: [...discardPile, ...state.currentHand],
                reshuffles,
                score: newScore,
                round: state.round + 1,
                bet: null,
                pendingTileUpdate,
                gameOver: true,
                gameOverReason: 'tile_limit',
            })
            return
        }

        set({
            currentHand: newHand,
            newHand: [],
            drawPile,
            discardPile: [...discardPile, ...state.currentHand],
            reshuffles,
            score: newScore,
            round: state.round + 1,
            bet: null,
            pendingTileUpdate,
        })
    },

    reshuffle: () => {
        const { drawPile, discardPile, reshuffles } = get()
        if (drawPile.length >= TILES_PER_HAND) return

        const newReshuffles = reshuffles + 1
        if (newReshuffles >= MAX_RESHUFFLES) {
            set({ gameOver: true, gameOverReason: 'max_reshuffles', reshuffles: newReshuffles })
            return
        }

        const freshDeck = createDrawPile()
        const newDrawPile = shufflePile([...freshDeck, ...discardPile])
        set({ drawPile: newDrawPile, discardPile: [], reshuffles: newReshuffles })
    },

    exitGame: () => {
        set(initialState())
    },

    saveScore: () => {
        const { score, date } = get()
        const user = useGameStore.getState().user
        if (!user) return

        setScoreEntry({
            username: user.username,
            score,
            durationMs: Date.now() - date.getTime(),
            date: date.toISOString(),
        })
    },

    applyTileUpdate: () => {
        const { pendingTileUpdate } = get()
        if (!pendingTileUpdate) return

        const delta = pendingTileUpdate.betCorrect ? 1 : -1
        const seen = new Set<Tile>()
        for (const tile of pendingTileUpdate.tiles) {
            if (!seen.has(tile)) {
                seen.add(tile)
                tile.value += delta
            }
        }

        set({ pendingTileUpdate: null })
    },

    getSpecialCardValues: () => {
        return [...DRAGON_TILES, ...WIND_TILES].map(tile => ({ ...tile }))
    },
}))

export default useGameSessionStore
