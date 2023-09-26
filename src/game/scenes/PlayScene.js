import { Scene } from 'phaser'
import Slime from '../objects/Slime'
import Player from '../objects/Player'
import Demon from '../objects/Demon'

import { sceneEvents } from '../events/EventCenter'
import Chest from '../objects/Chest'

export default class PlayScene extends Scene {

  constructor () {
    super({ key: 'PlayScene' })
  }

  preload() { 
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create () {
    // 게임 UI 로드
    this.scene.run('GameUi')
    
    // 맵 생성
    const map = this.make.tilemap( {key: 'dungeon'} )
    const tileset = map.addTilesetImage('dungeon', 'tiles')
    map.createLayer('Ground', tileset)
    const wallLayer = map.createLayer('Wall', tileset)

    // 보물상자 생성 
    const chests = this.physics.add.staticGroup({
      classType: Chest
    })
    
    const chestLayer = map.getObjectLayer('Chest')
    chestLayer.objects.forEach((chest) => {
      chests.get(chest.x, chest.y, 'chest')
    })

    // 충돌 설정
    wallLayer.setCollisionByProperty({ collides: true })

    // 디버깅
    // const debugGraphicsLayer = this.add.graphics().setAlpha(0.7)
    // wallLayer.renderDebug(debugGraphicsLayer, {
    //   tileColor: null,
    //   collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    // })

    // 캐릭터 스폰
    this.faune = this.add.faune(120, 120, 'faune')

    // 카메라 팔로잉
    this.cameras.main.setZoom(3,3)
    this.cameras.main.startFollow(this.faune, true)

    // 슬라임 스폰
    const slime = this.physics.add.group({
      classType: Slime,
      createCallback: (go) => {
        go.body.onCollide = true
      }
    })
    slime.get(250, 120, 'slime')

    // 데몬 스폰
    const demon = this.physics.add.group({
      classType: Demon,
      createCallback: (go) => {
        go.body.onCollide = true
      }
    })
    demon.get(450, 320, 'demon')

    // 충돌 설정
    this.physics.add.collider(this.faune, wallLayer)
    this.physics.add.collider(this.faune, chests, this.handlePlayerChestCollision, undefined, this)
    this.physics.add.collider(slime, wallLayer)
    this.physics.add.collider(demon, wallLayer)
    this.physics.add.collider(slime, this.faune, this.handlePlayerMobCollision, undefined, this)
    this.physics.add.collider(demon, this.faune, this.handlePlayerMobCollision, undefined, this)

    // this.physics.add.collider()
  }

  // 상자와 충돌 시
  handlePlayerChestCollision(player, chest) {
    player.setChest(chest)
  }

  // 몬스터와 충돌할 때
  handlePlayerMobCollision(player, slime) {
    const dx = this.faune.x - slime.x
    const dy = this.faune.y - slime.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
    this.faune.handleDamage(dir)

    // 씬 이벤트
    sceneEvents.emit('player-health-changed', this.faune._health)
  }

  update (t, dt) {
    if (this.faune) {
      this.faune.update(this.cursors)
    }
  }
  
}
