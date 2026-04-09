import type { Tile } from '../../types/tile'
import TileCard from './TileCard'
import { TILES_PER_HAND } from '../../constants/tiles'

type HandDisplayProps = {
    hand: Tile[]
    faceDown?: boolean
    label?: string
    size?: 'standard' | 'history'
    revealedCount?: number
    animateReveal?: boolean
}

export default function HandDisplay({
    hand,
    faceDown = false,
    label,
    size = 'standard',
    revealedCount,
    animateReveal = false,
}: HandDisplayProps) {
    const totalValue = hand.reduce((sum, t) => sum + t.value, 0)
    const visibleTileCount = faceDown ? 0 : Math.min(revealedCount ?? hand.length, hand.length)
    const slots = faceDown
        ? Array.from({ length: TILES_PER_HAND }, () => null)
        : hand

    return (
        <div className="flex flex-col items-center gap-2">
            {label && (
                <span className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                    {label}
                </span>
            )}
            <div className="flex items-center gap-2">
                {slots.map((tile, i) => {
                    const isVisible = !faceDown && i < visibleTileCount

                    return (
                        <TileCard
                            key={`${i}-${isVisible ? 'face-up' : 'face-down'}`}
                            tile={isVisible ? tile : null}
                            faceDown={!isVisible}
                            size={size}
                            animateReveal={animateReveal && isVisible}
                        />
                    )
                })}
            </div>
            {!faceDown && visibleTileCount === hand.length && hand.length > 0 && (
                <span className="font-mono text-2xl font-bold text-text-primary">
                    {totalValue}
                </span>
            )}
        </div>
    )
}
