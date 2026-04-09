import type { Tile } from '../../types/tile'
import { getTileImage, tileBackImage } from '../../assets/tiles/index'
import { motion } from 'motion/react'

type TileCardProps = {
    tile: Tile | null
    faceDown?: boolean
    size?: 'standard' | 'history'
    animateReveal?: boolean
}

const sizeClasses = {
    standard: 'w-[72px] h-[100px]',
    history: 'w-[48px] h-[66px]',
} as const

const valueSizeClasses = {
    standard: 'text-xs font-bold',
    history: 'text-[10px] font-bold',
} as const

function getCategoryBorder(tile: Tile): string {
    if (tile.category === 'dragon') {
        if (tile.name === 'red') return 'border-[#7F1D1D]'
        if (tile.name === 'green') return 'border-[#166534]'
        return 'border-[#475569]'
    }
    if (tile.category === 'wind') return 'border-[#1E40AF]'
    return 'border-border'
}

function getValueBadgeClasses(tile: Tile): string {
    if (tile.category === 'number') {
        return 'bg-slate-700/55 text-slate-100'
    }

    if (tile.category === 'wind') {
        return 'bg-blue-700/85 text-white'
    }

    if (tile.name === 'red') return 'bg-red-800/85 text-red-50'
    if (tile.name === 'green') return 'bg-green-800/85 text-green-50'
    return 'bg-slate-800/85 text-slate-50'
}

export default function TileCard({ tile, faceDown = false, size = 'standard', animateReveal = false }: TileCardProps) {
    const sizeClass = sizeClasses[size]
    const valueSize = valueSizeClasses[size]

    if (faceDown || !tile) {
        return (
            <div className={`${sizeClass} flex-shrink-0 overflow-hidden rounded-lg border border-border bg-bg-elevated`}>
                <img src={tileBackImage} alt="Hidden tile" className="h-full w-full object-cover" draggable={false} />
            </div>
        )
    }

    const borderColor = getCategoryBorder(tile)
    const valueBadgeClasses = getValueBadgeClasses(tile)

    return (
        <motion.div
            className={`${sizeClass} relative flex flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-lg border-2 ${borderColor} bg-[#F8FAFC]`}
            initial={animateReveal ? { opacity: 0, scale: 0.92, y: 12, rotateY: -90 } : false}
            animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{ transformStyle: 'preserve-3d' }}
        >
            <img
                src={getTileImage(tile)}
                alt={tile.category === 'number' ? `${tile.value} tile` : `${tile.name} ${tile.category} tile`}
                className="h-full w-full object-contain p-1"
                draggable={false}
            />
            <span className={`absolute bottom-0.5 right-0.5 rounded px-1 ${valueBadgeClasses} ${valueSize} font-mono`}>
                {tile.value}
            </span>
        </motion.div>
    )
}
