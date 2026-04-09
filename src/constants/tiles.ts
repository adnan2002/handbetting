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
export const TILES_PER_HAND = 4
export const MIN_SCORE = 0





export function shufflePile(arr: Tile[]): Tile[] {
    for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; 
    }
    return arr;
}


export function createDrawPile(): Tile[] {
    return shufflePile([...ALL_TILE_TYPES].flatMap(tile => Array(COPIES_PER_TILE).fill(tile)))
}



export function getTileValue(tile: Tile): number {
    return tile.value
}

export function resetTileValues(): void {
    for (const tile of WIND_TILES) tile.value = 5
    for (const tile of DRAGON_TILES) tile.value = 5
}


