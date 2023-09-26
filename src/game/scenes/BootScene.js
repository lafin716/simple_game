import { Scene } from 'phaser'
import TileImageSource from '@/game/assets/tiles/dungeon_1.png'
import Dungeon from '@/game/assets/tiles/dungeon.json'

import TileSecond from '@/game/assets/tiles/second.png'
import SecondRoom from '@/game/assets/tiles/second.json'

import FaunePng from '@/game/assets/character/faune.png'
import FauneJson from '@/game/assets/character/faune.json'
import SlimePng from '@/game/assets/enermies/slime.png'
import SlimeJson from '@/game/assets/enermies/slime.json'
import DemonPng from '@/game/assets/enermies/demon.png'
import DemonJson from '@/game/assets/enermies/demon.json'
import ChestPng from '@/game/assets/objects/chest.png'
import ChestJson from '@/game/assets/objects/chest.json'
import UiHeartEmpty from '@/game/assets/ui/ui_heart_empty.png'
import UiHeartHalf from '@/game/assets/ui/ui_heart_half.png'
import UiHeartFull from '@/game/assets/ui/ui_heart_full.png'
import BombPng from '@/game/assets/objects/bomb.png'
export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    // 맵 로딩
    this.load.image('tiles', TileImageSource)
    this.load.image('tiles2', TileSecond)
    this.load.tilemapTiledJSON('dungeon', Dungeon)
    this.load.tilemapTiledJSON('second', SecondRoom)

    // 스프라이트 로딩
    this.load.aseprite('faune', FaunePng, FauneJson)
    this.load.aseprite('slime', SlimePng, SlimeJson)
    this.load.aseprite('demon', DemonPng, DemonJson)
    this.load.aseprite('chest', ChestPng, ChestJson)

    // 이미지 로딩
    this.load.image('ui-heart-empty', UiHeartEmpty)
    this.load.image('ui-heart-half', UiHeartHalf)
    this.load.image('ui-heart-full', UiHeartFull)
    this.load.image('bomb', BombPng)

  }

  create () {
    this.anims.createFromAseprite('faune')
    this.anims.createFromAseprite('slime')
    this.anims.createFromAseprite('demon')
    this.anims.createFromAseprite('chest')

    this.scene.start('PlayScene')
  }
}
