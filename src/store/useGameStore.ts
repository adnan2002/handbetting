import {create} from 'zustand'
import type {User} from '../types/game'
import {setUser} from '../hooks/userLocalStorage'



type GameStore = {
    user: User | null
    setUser: (user: User) => void
    getUserStatus: () => 'not_signed_in' | 'signed_in'
}

const useGameStore = create<GameStore>((set, get) => ({
    user: null,
    setUser: (user: User) => {
        setUser(user)
        set({ user })
    },
    getUserStatus: () => {
        const user = get().user
        if (!user) return 'not_signed_in'
        return 'signed_in'
    }
}))

export default useGameStore