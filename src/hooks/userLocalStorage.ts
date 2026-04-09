import type { User, ScoreEntry } from '../types/game'

const USERS_STORAGE_KEY = 'users'
const SCORES_STORAGE_KEY = 'scores'

export const getUser = (user:User): User | null => {
    const users = getUsers()
    return users.find(u => u.username === user.username) || null
}

export const getUsers = (): User[] => {
    const users = localStorage.getItem(USERS_STORAGE_KEY)
    return users ? JSON.parse(users) : []
}

export const setUser = (user: User) => {
    const users = getUsers()
    const exists = users.find(u => u.username === user.username)
    if (!exists) {
        users.push(user)
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    }
}

export const getScores = (): ScoreEntry[] => {
    const scores = localStorage.getItem(SCORES_STORAGE_KEY)
    return scores ? JSON.parse(scores) : []
}

export const getTopScores = (limit = 5): ScoreEntry[] => {
    return [...getScores()].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        if (a.durationMs !== b.durationMs) return a.durationMs - b.durationMs
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    }).slice(0, limit)
}

export const setScoreEntry = (scoreEntry: ScoreEntry) => {
    const scores = getScores()
    scores.push(scoreEntry)
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(scores))
}

// ── Hand History (per-user) ──

export type HandHistoryEntry = {
    round: number
    tiles: Array<{ category: string; name?: string; value: number }>
    totalValue: number
    result: 'win' | 'loss' | 'tie'
}

function historyKey(username: string): string {
    return `hand_history_${username}`
}

export const getHandHistory = (username: string): HandHistoryEntry[] => {
    const raw = localStorage.getItem(historyKey(username))
    return raw ? JSON.parse(raw) : []
}

export const addHandHistory = (username: string, entry: HandHistoryEntry): void => {
    const history = getHandHistory(username)
    history.push(entry)
    localStorage.setItem(historyKey(username), JSON.stringify(history))
}

export const clearHandHistory = (username: string): void => {
    localStorage.removeItem(historyKey(username))
}