import { getTileImage } from '../../assets/tiles/index'
import { AnimatePresence, motion } from 'motion/react'
import type { DragonTile, WindTile } from '../../types/tile'

type TileDeltaDirection = 1 | -1
type TileDeltaEvent = {
    pulseId: number
    changes: Record<string, TileDeltaDirection>
}

type TileValueTrackerProps = {
    tiles: Array<DragonTile | WindTile>
    deltaEvent?: TileDeltaEvent | null
}

function valueColor(value: number): string {
    if (value > 5) return 'text-win'
    if (value < 5) return 'text-loss'
    return 'text-text-primary'
}

export default function TileValueTracker({ tiles, deltaEvent = null }: TileValueTrackerProps) {
    return (
        <div className="w-full rounded-lg border border-border bg-bg-secondary p-4">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                Dynamic Tile Values
            </h3>
            <div className="grid grid-cols-7 gap-2">
                {tiles.map((tile) => {
                    const label = tile.name.charAt(0).toUpperCase() + tile.name.slice(1)
                    const tileKey = `${tile.category}-${tile.name}`
                    const delta = deltaEvent?.changes[tileKey]
                    return (
                        <div key={tileKey} className="flex flex-col items-center gap-1">
                            <div className="relative h-9 w-9 overflow-visible rounded">
                                <img
                                    src={getTileImage(tile)}
                                    alt={label}
                                    className="h-full w-full object-contain"
                                    draggable={false}
                                />
                                <AnimatePresence>
                                    {delta && deltaEvent && (
                                        <motion.span
                                            key={`${tileKey}-${deltaEvent.pulseId}`}
                                            initial={{ opacity: 0, y: 8, scale: 0.92 }}
                                            animate={{ opacity: 1, y: -12, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.96 }}
                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                            className={`pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 font-mono text-xs font-bold ${
                                                delta > 0 ? 'text-win' : 'text-loss'
                                            }`}
                                        >
                                            {delta > 0 ? '+1' : '-1'}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                            <span className="text-[10px] text-text-secondary">{label}</span>
                            <motion.span
                                key={`${tileKey}-${tile.value}`}
                                initial={delta ? { scale: 1.22 } : false}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.28, ease: 'easeOut' }}
                                className={`font-mono text-sm font-bold ${valueColor(tile.value)}`}
                            >
                                {tile.value}
                            </motion.span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
