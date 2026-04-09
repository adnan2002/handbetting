import type { Tile } from './tile'

export type User = {
    username: string
}

export type ScoreEntry = {
    username: string
    score: number
    durationMs: number
    date: string
}

export type BetDirection = 'higher' | 'lower'

export type GameOverReason = 'tile_limit' | 'max_reshuffles' | null

export type GameSession = {
    round: number
    discardPile: Tile[]
    drawPile: Tile[]
    score: number
    currentHand: Tile[]
    newHand: Tile[]
    reshuffles: number
    bet: BetDirection | null
    date: Date
    gameOver: boolean
    gameOverReason: GameOverReason
    pendingTileUpdate: { betCorrect: boolean; tiles: Tile[] } | null
}

