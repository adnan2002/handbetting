export type WindName = 'east' | 'south' | 'west' | 'north'
export type DragonName = 'white' | 'green' | 'red'

export type NumberTile = { category: 'number'; value: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 }
export type WindTile = { category: 'wind'; name: WindName; value: 5 }
export type DragonTile = { category: 'dragon'; name: DragonName; value: 5 }

export type Tile = NumberTile | WindTile | DragonTile
