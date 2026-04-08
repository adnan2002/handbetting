import { useState, type SubmitEvent } from 'react'
import { useNavigate } from 'react-router'
import useGameStore from '../../store/useGameStore'
import { getUser } from '../../hooks/userLocalStorage'
import type { User } from '../../types/game'
import Button from '../../components/Button'


const SignIn = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const { setUser } = useGameStore()

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmed = username.trim()
        if (!trimmed) return

        const lookup: User = { username: trimmed }
        const existing = getUser(lookup)

        setUser(existing ?? lookup)
        navigate('/game')
    }

    const canContinue = username.trim().length > 0

    return (
        <div className="mx-auto max-w-lg space-y-8 text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
                Sign in
            </h1>
            <p className="text-balance text-base leading-relaxed text-text-secondary">
                Enter your unique username. This identifies you on the leaderboard for this
                session.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-text-secondary">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        placeholder="e.g. tile_master"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 font-body text-text-primary placeholder:text-text-muted focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/40"
                    />
                </div>
                <div className="text-center">
                    <Button type="submit" disabled={!canContinue}>
                        Continue to game
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default SignIn
