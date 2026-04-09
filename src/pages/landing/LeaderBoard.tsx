import type { ScoreEntry } from '../../types/game'





function formatDuration(ms: number): string {
    const totalSec = Math.round(ms / 1000)
    const m = Math.floor(totalSec / 60)
    const s = totalSec % 60
    if (m === 0) return `${s}s`
    return `${m}:${String(s).padStart(2, '0')}`
}

const LEADERBOARD_ROWS = 5

const LeaderBoard = ({ entries }: { entries: ScoreEntry[] }) => {
    const rows = Array.from({ length: LEADERBOARD_ROWS }, (_, index) => entries[index] ?? null)

    return (
        <section className="w-full space-y-4">
            <h2 className="font-display text-xl font-semibold text-text-primary">
                Leaderboard
            </h2>
            <div className="overflow-hidden rounded-lg border border-border bg-bg-secondary shadow-sm">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-border bg-bg-elevated text-text-secondary">
                            <th className="px-4 py-3 font-medium" scope="col">
                                #
                            </th>
                            <th className="px-4 py-3 font-medium" scope="col">
                                Player
                            </th>
                            <th className="px-4 py-3 text-right font-medium tabular-nums" scope="col">
                                Score
                            </th>
                            <th className="hidden px-4 py-3 text-right font-medium sm:table-cell" scope="col">
                                Time
                            </th>
                            <th className="hidden px-4 py-3 text-right font-medium md:table-cell" scope="col">
                                Date
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((entry, index) => (
                            <tr
                                key={entry ? `${entry.username}-${entry.date}` : `empty-${index + 1}`}
                                className="border-b border-border last:border-b-0"
                            >
                                <td className="px-4 py-3 font-mono text-text-muted tabular-nums">
                                    {index + 1}
                                </td>
                                <td className="px-4 py-3 font-medium text-text-primary">
                                    {entry?.username ?? ''}
                                </td>
                                <td className="px-4 py-3 text-right font-mono text-win tabular-nums">
                                    {entry?.score ?? ''}
                                </td>
                                <td className="hidden px-4 py-3 text-right font-mono text-sm text-text-secondary tabular-nums sm:table-cell">
                                    {entry ? formatDuration(entry.durationMs) : ''}
                                </td>
                                <td className="hidden px-4 py-3 text-right text-text-secondary md:table-cell">
                                    {entry ? new Date(entry.date).toLocaleDateString(undefined, {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    }) : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default LeaderBoard