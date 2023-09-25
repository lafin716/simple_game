import { Scene } from 'phaser'
import TileImageSource from '@/game/assets/tiles/dungeon_1.png'
import Dungeon from '@/game/assets/tiles/dungeon.json'
import FaunePng from '@/game/assets/character/faune.png'
import FauneJson from '@/game/assets/character/faune.json'
import SlimePng from '@/game/assets/enermies/slime.png'
import SlimeJson from '@/game/assets/enermies/slime.json'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('tiles', TileImageSource)
    this.load.tilemapTiledJSON('dungeon', Dungeon)

    this.load.aseprite('faune', FaunePng, FauneJson)
    this.load.aseprite('slime', SlimePng, SlimeJson)
  }

  create () {
    this.anims.createFromAseprite('faune')
    this.anims.createFromAseprite('slime')

    this.scene.start('PlayScene')
  }
}
