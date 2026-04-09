import { useState, useCallback, useEffect } from 'react'
import useGameSessionStore from '../../store/useGameSessionStore'
import useGameStore from '../../store/useGameStore'
import type { BetDirection } from '../../types/game'
import type { Tile } from '../../types/tile'
import { addHandHistory, clearHandHistory, getHandHistory, type HandHistoryEntry } from '../../hooks/userLocalStorage'

import TopBar from './TopBar'
import HandDisplay from './HandDisplay'
import BettingControls from './BettingControls'
import TileValueTracker from './TileValueTracker'
import HistoryStrip from './HistoryStrip'
import GameOverScreen from './GameOverScreen'
import DeckShuffleDeal from './DeckShuffleDeal'
import withUserStatus from '../../hoc/withUserStatus'

type Phase = 'idle' | 'starting' | 'reshuffling' | 'betting' | 'revealing' | 'revealed' | 'gameOver'
type TileDeltaDirection = 1 | -1
type TileDeltaEvent = {
    pulseId: number
    changes: Record<string, TileDeltaDirection>
}
type ScoreDeltaEvent = {
    pulseId: number
    delta: 1 | -1
}
type DealAnimation = {
    mode: 'start' | 'reshuffle'
    dealtCount: number
    pendingHand: Tile[]
    onCompletePhase: Extract<Phase, 'betting' | 'revealing'>
}

type RevealedState = {
    oldHand: Tile[]
    oldValue: number
    newHand: Tile[]
    newValue: number
    result: 'win' | 'loss' | 'tie'
    gameOver: boolean
    historyEntry: HandHistoryEntry | null
    scoreAfterRound: number
    scoreDelta: 1 | -1 | 0
}

const REVEAL_STEP_MS = 220
const REVEAL_COMPLETE_DELAY_MS = 180
const TILE_DELTA_ANIMATION_MS = 650
const SHUFFLE_DEAL_STEP_MS = 220
const SHUFFLE_SETTLE_MS = 260

function getTileDeltaChanges(tiles: Tile[], delta: TileDeltaDirection): Record<string, TileDeltaDirection> {
    const changes: Record<string, TileDeltaDirection> = {}

    for (const tile of tiles) {
        if (tile.category === 'number') continue
        changes[`${tile.category}-${tile.name}`] = delta
    }

    return changes
}

 function Game() {
    const [phase, setPhase] = useState<Phase>('idle')
    const [revealed, setRevealed] = useState<RevealedState | null>(null)
    const [revealedTileCount, setRevealedTileCount] = useState(0)
    const [history, setHistory] = useState<HandHistoryEntry[]>([])
    const [tileDeltaEvent, setTileDeltaEvent] = useState<TileDeltaEvent | null>(null)
    const [displayedScore, setDisplayedScore] = useState(0)
    const [scoreDeltaEvent, setScoreDeltaEvent] = useState<ScoreDeltaEvent | null>(null)
    const [dealAnimation, setDealAnimation] = useState<DealAnimation | null>(null)

    const store = useGameSessionStore()
    const username = useGameStore(s => s.user?.username ?? '')
    const dynamicTiles = store.getSpecialCardValues()
    const isRevealPhase = (phase === 'revealing' || phase === 'revealed') && revealed !== null

    useEffect(() => {
        if (phase !== 'revealing' || !revealed) return
        if (revealedTileCount >= revealed.newHand.length) return

        const timeoutId = window.setTimeout(() => {
            setRevealedTileCount(count => Math.min(count + 1, revealed.newHand.length))
        }, REVEAL_STEP_MS)

        return () => window.clearTimeout(timeoutId)
    }, [phase, revealed, revealedTileCount])

    useEffect(() => {
        if (phase !== 'revealing' || !revealed) return
        if (revealedTileCount < revealed.newHand.length) return

        const timeoutId = window.setTimeout(() => {
            if (username && revealed.historyEntry) {
                addHandHistory(username, revealed.historyEntry)
                setHistory(getHandHistory(username))
            }

            setDisplayedScore(revealed.scoreAfterRound)
            setScoreDeltaEvent(
                revealed.scoreDelta === 0
                    ? null
                    : { pulseId: Date.now(), delta: revealed.scoreDelta }
            )

            if (revealed.gameOver) {
                store.saveScore()
                setPhase('gameOver')
                return
            }

            setPhase('revealed')
        }, REVEAL_COMPLETE_DELAY_MS)

        return () => window.clearTimeout(timeoutId)
    }, [phase, revealed, revealedTileCount, store, username])

    useEffect(() => {
        if (!tileDeltaEvent) return

        const timeoutId = window.setTimeout(() => {
            setTileDeltaEvent(current => (
                current?.pulseId === tileDeltaEvent.pulseId ? null : current
            ))
        }, TILE_DELTA_ANIMATION_MS)

        return () => window.clearTimeout(timeoutId)
    }, [tileDeltaEvent])

    useEffect(() => {
        if (!scoreDeltaEvent) return

        const timeoutId = window.setTimeout(() => {
            setScoreDeltaEvent(current => (
                current?.pulseId === scoreDeltaEvent.pulseId ? null : current
            ))
        }, TILE_DELTA_ANIMATION_MS)

        return () => window.clearTimeout(timeoutId)
    }, [scoreDeltaEvent])

    useEffect(() => {
        if (!dealAnimation) return
        if (dealAnimation.dealtCount >= dealAnimation.pendingHand.length) return

        const timeoutId = window.setTimeout(() => {
            setDealAnimation(current => (
                current
                    ? { ...current, dealtCount: Math.min(current.dealtCount + 1, current.pendingHand.length) }
                    : null
            ))
        }, SHUFFLE_DEAL_STEP_MS)

        return () => window.clearTimeout(timeoutId)
    }, [dealAnimation])

    useEffect(() => {
        if (!dealAnimation) return
        if (dealAnimation.dealtCount < dealAnimation.pendingHand.length) return

        const timeoutId = window.setTimeout(() => {
            setPhase(dealAnimation.onCompletePhase)
            setDealAnimation(null)
        }, SHUFFLE_SETTLE_MS)

        return () => window.clearTimeout(timeoutId)
    }, [dealAnimation])

    const beginGame = useCallback(() => {
        if (username) clearHandHistory(username)
        setHistory([])
        store.startGame()
        setPhase('betting')
        setRevealed(null)
        setRevealedTileCount(0)
        setTileDeltaEvent(null)
        setDisplayedScore(0)
        setScoreDeltaEvent(null)
        setDealAnimation({
            mode: 'start',
            dealtCount: 0,
            pendingHand: useGameSessionStore.getState().currentHand,
            onCompletePhase: 'betting',
        })
        setPhase('starting')
    }, [store, username])

    useEffect(() => {
        if (phase !== 'idle') return

        if (store.currentHand.length > 0) {
            setDisplayedScore(store.score)
            setHistory(username ? getHandHistory(username) : [])
            setPhase('betting')
            return
        }

        beginGame()
    }, [beginGame, phase, store.currentHand.length, store.score, username])

    const handleBet = useCallback((direction: BetDirection) => {
        const oldHand = [...store.currentHand]
        const oldValue = oldHand.reduce((s, t) => s + t.value, 0)

        store.placeBet(direction)
        store.resolveBet()

        const resolvedState = useGameSessionStore.getState()
        const newGameOver = resolvedState.gameOver
        const hasResolvedNewHand = !newGameOver || resolvedState.newHand.length > 0
        const newHand = resolvedState.newHand.length > 0 ? resolvedState.newHand : resolvedState.currentHand
        const newValue = newHand.reduce((s, t) => s + t.value, 0)
        const scoreAfterRound = resolvedState.score
        const scoreDelta = scoreAfterRound > displayedScore ? 1 : scoreAfterRound < displayedScore ? -1 : 0
        const reshuffleUsed = resolvedState.reshuffles > store.reshuffles

        let result: 'win' | 'loss' | 'tie'
        if (newValue === oldValue) {
            result = 'tie'
        } else {
            const betCorrect =
                (direction === 'higher' && newValue > oldValue) ||
                (direction === 'lower' && newValue < oldValue)
            result = betCorrect ? 'win' : 'loss'
        }

        const entry: HandHistoryEntry = {
            round: resolvedState.round - 1,
            tiles: newHand.map(t => {
                if (t.category === 'number') return { category: t.category, value: t.value }
                return { category: t.category, name: t.name, value: t.value }
            }),
            totalValue: newValue,
            result,
        }
        if (!hasResolvedNewHand) {
            setDisplayedScore(scoreAfterRound)
            setScoreDeltaEvent(
                scoreDelta === 0
                    ? null
                    : { pulseId: Date.now(), delta: scoreDelta }
            )
            store.saveScore()
            setPhase('gameOver')
            return
        }
        setRevealedTileCount(0)
        setRevealed({
            oldHand,
            oldValue,
            newHand,
            newValue,
            result,
            gameOver: newGameOver,
            historyEntry: entry,
            scoreAfterRound,
            scoreDelta,
        })
        if (reshuffleUsed) {
            setRevealedTileCount(0)
            setDealAnimation({
                mode: 'reshuffle',
                dealtCount: 0,
                pendingHand: newHand,
                onCompletePhase: 'revealing',
            })
            setPhase('reshuffling')
            return
        }
        setPhase('revealing')
    }, [displayedScore, store])

    const nextRound = useCallback(() => {
        const deltaChanges = store.pendingTileUpdate
            ? getTileDeltaChanges(store.pendingTileUpdate.tiles, store.pendingTileUpdate.betCorrect ? 1 : -1)
            : null

        store.applyTileUpdate()
        setRevealed(null)
        setRevealedTileCount(0)
        setTileDeltaEvent(
            deltaChanges && Object.keys(deltaChanges).length > 0
                ? { pulseId: Date.now(), changes: deltaChanges }
                : null
        )
        setPhase('betting')
    }, [store])

    const handlePlayAgain = useCallback(() => {
        beginGame()
    }, [beginGame])

    const isStartDealPhase = phase === 'starting' && dealAnimation?.mode === 'start'
    const isReshuffleDealPhase = phase === 'reshuffling' && dealAnimation?.mode === 'reshuffle'

    if (phase === 'idle') return null

    return (
        <section className="flex w-full flex-1 flex-col gap-6 py-2">
            <div className="w-full">
                <TopBar score={displayedScore} scoreDeltaEvent={scoreDeltaEvent} />
            </div>

            <div className="grid flex-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(22rem,0.85fr)]">
                <div className="rounded-3xl border border-border bg-bg-secondary p-6 shadow-sm sm:p-8">
                    {(phase === 'betting' || isRevealPhase || isStartDealPhase || isReshuffleDealPhase) && (
                        <div className="flex h-full flex-col justify-between gap-8">
                            <div className="grid gap-8">
                                <div className="rounded-2xl border border-border bg-bg-elevated/60 px-4 py-6">
                                    {isStartDealPhase && dealAnimation ? (
                                        <div className="flex flex-col items-center gap-6">
                                            <DeckShuffleDeal mode={dealAnimation.mode} dealtCount={dealAnimation.dealtCount} />
                                            <HandDisplay
                                                hand={dealAnimation.pendingHand}
                                                faceDown={false}
                                                revealedCount={dealAnimation.dealtCount}
                                                label="Current Hand"
                                            />
                                        </div>
                                    ) : (
                                        <HandDisplay
                                            hand={isRevealPhase && revealed ? revealed.oldHand : store.currentHand}
                                            label="Current Hand"
                                        />
                                    )}
                                </div>
                                <div className="rounded-2xl border border-border bg-bg-elevated/60 px-4 py-6">
                                    {isReshuffleDealPhase && dealAnimation ? (
                                        <div className="flex flex-col items-center gap-6">
                                            <DeckShuffleDeal mode={dealAnimation.mode} dealtCount={dealAnimation.dealtCount} />
                                            <HandDisplay
                                                hand={dealAnimation.pendingHand}
                                                faceDown
                                                label="Next Hand"
                                            />
                                        </div>
                                    ) : (
                                        <HandDisplay
                                            hand={isRevealPhase && revealed ? revealed.newHand : store.currentHand}
                                            faceDown={!isRevealPhase}
                                            revealedCount={phase === 'revealing' ? revealedTileCount : undefined}
                                            animateReveal={phase === 'revealing'}
                                            label="Next Hand"
                                        />
                                    )}
                                </div>
                            </div>
                            {phase === 'revealed' && revealed ? (
                                <div className="flex flex-col items-center gap-5 text-center">
                                    <span className={`text-xl font-bold ${
                                        revealed.result === 'win' ? 'text-win' : revealed.result === 'loss' ? 'text-loss' : 'text-neutral'
                                    }`}>
                                        {revealed.oldValue} vs {revealed.newValue} &mdash; {revealed.result === 'win' ? 'You Win!' : revealed.result === 'loss' ? 'You Lose' : 'Tie'}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={nextRound}
                                        className="rounded-lg border border-border bg-bg-elevated px-8 py-3 font-body text-sm font-semibold text-text-primary transition hover:border-accent hover:text-accent"
                                    >
                                        Next Round
                                    </button>
                                </div>
                            ) : phase === 'betting' ? (
                                <div className="flex justify-center">
                                    <BettingControls onBet={handleBet} disabled={false} />
                                </div>
                            ) : (
                                <div className="h-[56px]" />
                            )}
                        </div>
                    )}
                </div>

                <aside className="flex flex-col gap-6">
                    <TileValueTracker tiles={dynamicTiles} deltaEvent={tileDeltaEvent} />
                    <div className="flex-1">
                        <HistoryStrip history={history} />
                    </div>
                </aside>
            </div>

            {phase === 'gameOver' && <GameOverScreen onPlayAgain={handlePlayAgain} />}
        </section>
    )
}

export default withUserStatus(Game)