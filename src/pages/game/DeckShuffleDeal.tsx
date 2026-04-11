import { motion } from 'motion/react'
import { tileBackImage } from '../../assets/tiles/index'
import {TILES_PER_HAND} from '../../constants/tiles'

type DeckShuffleDealProps = {
    mode: 'start' | 'reshuffle'
    dealtCount: number
}

const targetOffsets = [-120, -40, 40, 120]

export default function DeckShuffleDeal({ mode, dealtCount }: DeckShuffleDealProps) {
    return (
        <div className="relative mx-auto h-40 w-full max-w-[30rem] overflow-hidden">
            <div className="absolute inset-x-0 top-0 flex justify-center">
                <span className="rounded-full border border-border bg-bg-secondary/90 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-text-secondary">
                    {mode === 'start' ? 'Drawing opening hand' : 'Shuffling tiles...'}
                </span>
            </div>

            <div className="absolute left-1/2 top-10 -translate-x-[10.5rem]">
                {Array.from({ length: TILES_PER_HAND }, (_, index) => (
                    <motion.img
                        key={index}
                        src={tileBackImage}
                        alt=""
                        aria-hidden="true"
                        className="absolute h-[100px] w-[72px] rounded-lg border border-border bg-bg-elevated shadow-sm"
                        style={{ left: index * 3, top: index * 2, zIndex: 10 - index }}
                        animate={{
                            x: dealtCount === 0 ? [0, 12, -10, 0] : 0,
                            y: dealtCount === 0 ? [0, -4, 2, 0] : 0,
                            rotate: dealtCount === 0 ? [0, -5, 4, 0] : 0,
                        }}
                        transition={{
                            duration: 0.48,
                            ease: 'easeInOut',
                            delay: index * 0.04,
                        }}
                    />
                ))}
            </div>

            <div className="absolute left-1/2 top-[5.2rem] flex -translate-x-1/2 items-center gap-2">
                {targetOffsets.map((offset, index) => (
                    <motion.div
                        key={index}
                        className="relative h-[100px] w-[72px]"
                        initial={false}
                        animate={{ x: offset / 3 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        <div className="absolute inset-0 rounded-lg border border-dashed border-border/50 bg-bg-elevated/25" />
                        {index < dealtCount && (
                            <motion.img
                                key={`${mode}-${index}`}
                                src={tileBackImage}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 rounded-lg border border-border bg-bg-elevated shadow-md"
                                initial={{ opacity: 0, x: -170 - offset / 3, y: -54, rotate: -12, scale: 0.96 }}
                                animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                                transition={{ duration: 0.52, ease: 'easeOut' }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
