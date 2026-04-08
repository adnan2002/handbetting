import type { NumberTile, WindTile, DragonTile, Tile } from '../types/tile'

export const NUMBER_TILES: NumberTile[] = [
    { category: 'number', value: 1 },
    { category: 'number', value: 2 },
    { category: 'number', value: 3 },
    { category: 'number', value: 4 },
    { category: 'number', value: 5 },
    { category: 'number', value: 6 },
    { category: 'number', value: 7 },
    { category: 'number', value: 8 },
    { category: 'number', value: 9 },
]

export const WIND_TILES: WindTile[] = [
    { category: 'wind', name: 'east', value: 5 },
    { category: 'wind', name: 'south', value: 5 },
    { category: 'wind', name: 'west', value: 5 },
    { category: 'wind', name: 'north', value: 5 },
]

export const DRAGON_TILES: DragonTile[] = [
    { category: 'dragon', name: 'white', value: 5 },
    { category: 'dragon', name: 'green', value: 5 },
    { category: 'dragon', name: 'red', value: 5 },
]

export const ALL_TILE_TYPES: Tile[] = [
    ...NUMBER_TILES,
    ...WIND_TILES,
    ...DRAGON_TILES,
]

export const COPIES_PER_TILE = 4
export const MAX_RESHUFFLES = 3



// Needs Implementing
// export function shuffleDeck(deck: Tile[]): Tile[] 
// export function createDeck(): Tile[] 




export function getTileValue(tile: Tile): number {
    return tile.value
}
