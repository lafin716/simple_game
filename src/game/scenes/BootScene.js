import { Scene } from 'phaser'
import island from '@/game/assets/pokemon_map.png'
import playerUp from '@/game/assets/playerUp.png'
import playerDown from '@/game/assets/playerDown.png'
import playerLeft from '@/game/assets/playerLeft.png'
import playerRight from '@/game/assets/playerRight.png'
import TileImageSource from '@/game/assets/tiles/dungeon_1.png'
import Dungeon from '@/game/assets/tiles/dungeon.json'
import FaunePng from '@/game/assets/character/faune.png'
import FauneJson from '@/game/assets/character/faune.json'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('tiles', TileImageSource)
    this.load.tilemapTiledJSON('dungeon', Dungeon)

    this.load.aseprite('faune', FaunePng, FauneJson)
  }

  create () {
    this.anims.createFromAseprite('faune')

    this.scene.start('PlayScene')
  }
}
