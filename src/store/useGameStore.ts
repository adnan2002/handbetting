import {create} from 'zustand'
import type {User} from '../types/game'
import {setUser} from '../hooks/userLocalStorage'



type GameStore = {
    user: User | null
    setUser: (user: User) => void
}

const useGameStore = create<GameStore>((set) => ({
    user: null,
    setUser: (user: User) => {
        setUser(user)
        set({ user })
    }
}))

export default useGameStore