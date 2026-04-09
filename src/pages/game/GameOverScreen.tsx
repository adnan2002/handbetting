import useGameSessionStore from '../../store/useGameSessionStore'
import { useNavigate } from 'react-router'
import Button from '../../components/Button'

type GameOverScreenProps = {
    onPlayAgain: () => void
}

const reasonText: Record<string, string> = {
    tile_limit: 'A tile reached its value boundary (0 or 10)',
    max_reshuffles: 'The draw pile was exhausted 3 times',
}

export default function GameOverScreen({ onPlayAgain }: GameOverScreenProps) {
    const navigate = useNavigate()
    const { score, gameOverReason, round, reshuffles, exitGame } = useGameSessionStore()

    const handleExit = () => {
        exitGame()
        navigate('/')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="mx-4 w-full max-w-md rounded-xl border border-border bg-bg-secondary p-8 text-center">
                <h2 className="font-display text-2xl font-bold text-text-primary">
                    Game Over
                </h2>

                <div className="mt-6">
                    <span className="text-xs uppercase tracking-wider text-text-secondary">Final Score</span>
                    <p className="mt-1 font-mono text-5xl font-bold text-accent">{score}</p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-border bg-bg-elevated p-4 text-sm">
                    <div>
                        <span className="text-text-muted">Rounds</span>
                        <p className="font-mono font-bold text-text-primary">{round - 1}</p>
                    </div>
                    <div>
                        <span className="text-text-muted">Reshuffles</span>
                        <p className="font-mono font-bold text-text-primary">{reshuffles}</p>
                    </div>
                </div>

                {gameOverReason && (
                    <p className="mt-4 text-sm text-text-secondary">
                        {reasonText[gameOverReason] ?? 'Unknown reason'}
                    </p>
                )}

                <div className="mt-8 flex items-center justify-center gap-3">
                    <Button onClick={onPlayAgain}>
                        Play Again
                    </Button>
                    <button
                        type="button"
                        onClick={handleExit}
                        className="rounded-lg border border-border bg-transparent px-6 py-3 text-sm font-semibold text-text-primary transition hover:bg-bg-elevated"
                    >
                        Home
                    </button>
                </div>
            </div>
        </div>
    )
}
