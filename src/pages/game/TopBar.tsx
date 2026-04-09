import useGameSessionStore from '../../store/useGameSessionStore'
import { AnimatePresence, motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { MAX_RESHUFFLES } from '../../constants/tiles'

type ScoreDeltaEvent = {
    pulseId: number
    delta: 1 | -1
}

type TopBarProps = {
    score: number
    scoreDeltaEvent?: ScoreDeltaEvent | null
}

const pillClassName = 'inline-flex min-h-11 min-w-[6.5rem] items-center justify-center rounded-full border border-border bg-bg-elevated px-4 py-2 text-sm font-medium text-text-secondary'

export default function TopBar({ score, scoreDeltaEvent = null }: TopBarProps) {
    const navigate = useNavigate()
    const { drawPile, discardPile, reshuffles, round, exitGame } = useGameSessionStore()

    const handleExit = () => {
        exitGame()
        navigate('/')
    }

    return (
        <div className="flex w-full items-center justify-between gap-4">
            <button
                onClick={handleExit}
                className={`${pillClassName} gap-2 transition hover:border-loss hover:text-loss`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                </svg>
                Exit
            </button>

            <div className="flex items-center gap-3">
                <span className={pillClassName}>
                    Round: {round}
                </span>
                <div className={`${pillClassName} min-w-34 gap-2`}>
                    <span>Score</span>
                    <div className="relative">
                        <AnimatePresence>
                            {scoreDeltaEvent && (
                                <motion.span
                                    key={scoreDeltaEvent.pulseId}
                                    initial={{ opacity: 0, y: 6, scale: 0.92 }}
                                    animate={{ opacity: 1, y: -14, scale: 1 }}
                                    exit={{ opacity: 0, y: -22, scale: 0.96 }}
                                    transition={{ duration: 0.65, ease: 'easeOut' }}
                                    className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 font-mono text-xs font-bold ${
                                        scoreDeltaEvent.delta > 0 ? 'text-win' : 'text-loss'
                                    }`}
                                >
                                    {scoreDeltaEvent.delta > 0 ? '+1' : '-1'}
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <motion.span
                            key={score}
                            initial={scoreDeltaEvent ? { scale: 1.2, y: -2 } : false}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            className="block font-mono text-lg font-bold text-accent"
                        >
                            {score}
                        </motion.span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className={`${pillClassName} font-mono ${drawPile.length < 10 ? 'text-accent' : 'text-text-secondary'}`}>
                    Pile: {drawPile.length}
                </span>
                <span className={`${pillClassName} font-mono`}>
                    Discard: {discardPile.length}
                </span>
                <span className={`${pillClassName} font-mono text-text-muted`}>
                    {reshuffles}/{MAX_RESHUFFLES}
                </span>
            </div>
        </div>
    )
}
