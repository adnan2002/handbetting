import type { Tile } from '../../types/tile'
import type { HandHistoryEntry } from '../../hooks/userLocalStorage'
import TileCard from './TileCard'

type HistoryStripProps = {
    history: HandHistoryEntry[]
}

const resultBadge: Record<string, string> = {
    win: 'bg-win/20 text-win',
    loss: 'bg-loss/20 text-loss',
    tie: 'bg-neutral/20 text-neutral',
}

export default function HistoryStrip({ history }: HistoryStripProps) {
    if (history.length === 0) {
        return (
            <div className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-3">
                <p className="text-center text-sm italic text-text-muted">No previous hands</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full rounded-lg border border-border bg-bg-secondary p-4">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">
                History
            </h3>
            <div className="flex max-h-[580px] flex-col gap-3 overflow-y-auto">
                {[...history].reverse().map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-md border border-border/50 bg-bg-elevated/50 px-3 py-2">
                        <span className="font-mono text-xs text-text-muted">R{entry.round}</span>
                        <div className="flex items-center gap-1">
                            {entry.tiles.map((tile, j) => (
                                <TileCard key={j} tile={tile as Tile} size="history" />
                            ))}
                        </div>
                        <span className="font-mono text-sm font-bold text-text-secondary">
                            {entry.totalValue}
                        </span>
                        <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${resultBadge[entry.result]}`}>
                            {entry.result.toUpperCase()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
