import type { Tile, DragonTile, WindTile } from '../../types/tile'

import man1 from './Man1.svg'
import man2 from './Man2.svg'
import man3 from './Man3.svg'
import man4 from './Man4.svg'
import man5 from './Man5.svg'
import man6 from './Man6.svg'
import man7 from './Man7.svg'
import man8 from './Man8.svg'
import man9 from './Man9.svg'
import chun from './Chun.svg'
import hatsu from './Hatsu.svg'
import haku from './Haku.svg'
import ton from './Ton.svg'
import nan from './Nan.svg'
import shaa from './Shaa.svg'
import pei from './Pei.svg'
import back from './Back.svg'

const numberImages: Record<number, string> = {
  1: man1,
  2: man2,
  3: man3,
  4: man4,
  5: man5,
  6: man6,
  7: man7,
  8: man8,
  9: man9,
}

const dragonImages: Record<DragonTile['name'], string> = {
  red: chun,
  green: hatsu,
  white: haku,
}

const windImages: Record<WindTile['name'], string> = {
  east: ton,
  south: nan,
  west: shaa,
  north: pei,
}

export function getTileImage(tile: Tile): string {
  switch (tile.category) {
    case 'number':
      return numberImages[tile.value] ?? man1
    case 'dragon':
      return dragonImages[tile.name]
    case 'wind':
      return windImages[tile.name]
  }
}

export const tileBackImage = back
