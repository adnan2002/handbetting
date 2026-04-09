import type { BetDirection } from '../../types/game'

type BettingControlsProps = {
    onBet: (direction: BetDirection) => void
    disabled: boolean
}

export default function BettingControls({ onBet, disabled }: BettingControlsProps) {
    const base = 'flex h-14 flex-1 items-center justify-center gap-2 rounded-lg border font-body text-base font-semibold transition'
    const disabledClass = disabled ? 'opacity-40 pointer-events-none' : ''

    return (
        <div className="flex w-full max-w-sm gap-3">
            <button
                type="button"
                disabled={disabled}
                onClick={() => onBet('higher')}
                className={`${base} ${disabledClass} border-border bg-bg-elevated text-text-primary hover:border-win hover:text-win`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z" clipRule="evenodd" />
                </svg>
                Higher
            </button>
            <button
                type="button"
                disabled={disabled}
                onClick={() => onBet('lower')}
                className={`${base} ${disabledClass} border-border bg-bg-elevated text-text-primary hover:border-loss hover:text-loss`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v10.638l3.96-4.158a.75.75 0 1 1 1.08 1.04l-5.25 5.5a.75.75 0 0 1-1.08 0l-5.25-5.5a.75.75 0 1 1 1.08-1.04l3.96 4.158V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                </svg>
                Lower
            </button>
        </div>
    )
}
