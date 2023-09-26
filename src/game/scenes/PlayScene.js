import { Scene } from 'phaser'
import Slime from '../objects/Slime'
import Player from '../objects/Player'
import Demon from '../objects/Demon'

import { sceneEvents } from '../events/EventCenter'
import Chest from '../objects/Chest'

export default class PlayScene extends Scene {

  _monsterCollisions = []
  _weapons = null
  _slimes = null
  _demons = null

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
    wallLayer.setCollisionByProperty({ collides: true })

    // 무기 생성
    this._weapons = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 3
    })

    // 보물상자 생성 
    const chests = this.physics.add.staticGroup({
      classType: Chest
    })
    const chestLayer = map.getObjectLayer('Chest')
    chestLayer.objects.forEach((chest) => {
      chests.get(chest.x, chest.y, 'chest')
    })

    // 캐릭터 스폰
    this.faune = this.add.faune(120, 120, 'faune')
    this.faune.setWeapon(this._weapons)

    // 카메라 팔로잉
    this.cameras.main.setZoom(3,3)
    this.cameras.main.startFollow(this.faune, true)

    // 슬라임 스폰
    this._slimes = this.physics.add.group({
      classType: Slime,
      createCallback: (go) => {
        go.body.onCollide = true
      }
    })
    this._slimes.get(250, 120, 'slime')

    // 데몬 스폰
    this._demons = this.physics.add.group({
      classType: Demon,
      createCallback: (go) => {
        go.body.onCollide = true
      }
    })
    this._demons.get(450, 320, 'demon')

    // 충돌 설정 - 맵
    this.physics.add.collider(this.faune, wallLayer)
    this.physics.add.collider(this._slimes, wallLayer)
    this.physics.add.collider(this._demons, wallLayer)
    this.physics.add.collider(this._weapons, wallLayer, this.handleBombWallCollision, undefined, this)

    // 충돌 설정 - 상자
    this.physics.add.collider(this.faune, chests, this.handlePlayerChestCollision, undefined, this)

    // 충돌 설정 - 무기 => 몬스터
    this.physics.add.collider(this._weapons, this._slimes, this.handleBombSlimeCollision, undefined, this)
    this.physics.add.collider(this._weapons, this._demons, this.handleBombDemonCollision, undefined, this)

    // 충돌 설정 - 몬스터
    this._monsterCollisions = [
      this.physics.add.collider(this._slimes, this.faune, this.handlePlayerMobCollision, undefined, this),
      this.physics.add.collider(this._demons, this.faune, this.handlePlayerMobCollision, undefined, this),
    ]

    // this.physics.add.collider()
  }

  // 무기와 벽 충돌 시
  handleBombWallCollision(bomb, wall) {
    this._weapons.killAndHide(bomb)
  }

  // 무기와 슬라임 충돌 시 
  handleBombSlimeCollision(bomb, slime) {
    this._weapons.killAndHide(bomb)
    this._slimes.killAndHide(slime)
  }

  // 무기와 데몬 충돌 시 
  handleBombDemonCollision(bomb, demon) {
    this._weapons.killAndHide(bomb)
    this._demons.killAndHide(demon)
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

    // 플레이어가 죽으면 몬스터 충돌 이벤트 제거
    if (this.faune._health <= 0) {
      this._monsterCollisions.forEach((collider) => collider.destroy())
    }
  }

  update (t, dt) {
    if (this.faune) {
      this.faune.update(this.cursors)
    }
  }
  
}
