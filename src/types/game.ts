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

export type GameSession = {
    round: number
    discardPile: Tile[]
    drawPile: Tile[]
    score: number
    reshuffles: number
    currentTile: Tile | null
    bet: BetDirection | null
}

