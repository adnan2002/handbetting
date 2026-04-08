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

export const setScoreEntry = (scoreEntry: ScoreEntry) => {
    const scores = getScores()
    scores.push(scoreEntry)
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(scores))
}