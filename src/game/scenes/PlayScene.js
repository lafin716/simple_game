import { Scene } from 'phaser'
import Slime from '../objects/Slime'

export default class PlayScene extends Scene {

  constructor () {
    super({ key: 'PlayScene' })
  }

  preload() { 
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create () {
    
    // 맵 생성
    const map = this.make.tilemap( {key: 'dungeon'} )
    const tileset = map.addTilesetImage('dungeon', 'tiles')
    map.createLayer('Ground', tileset)
    const wallLayer = map.createLayer('Wall', tileset)

    // 충돌 설정
    wallLayer.setCollisionByProperty({ collides: true })

    // 디버깅
    const debugGraphicsLayer = this.add.graphics().setAlpha(0.7)
    wallLayer.renderDebug(debugGraphicsLayer, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })

    // 캐릭터 스폰
    this.faune = this.physics.add.sprite(120, 120, 'faune')
    this.faune.body.setSize(this.faune.body.width * 0.4, this.faune.body.height * 0.5)
    this.faune.body.offset.y = 20

    // 카메라 팔로잉
    this.cameras.main.startFollow(this.faune, true)

    // 슬라임 스폰
    const slime = this.physics.add.group({
      classType: Slime,
      createCallback: (go) => {
        go.body.onCollide = true
      }
    })
    slime.get(250, 120, 'slime')

    // 충돌 설정
    this.physics.add.collider(this.faune, wallLayer)
    this.physics.add.collider(slime, wallLayer)
    this.physics.add.collider(slime, this.faune, this.handlePlayerMobCollision, undefined, this)
  }

  // 몬스터와 충돌할 때
  handlePlayerMobCollision(player, slime) {
    const dx = this.faune.x - slime.x
    const dy = this.faune.y - slime.y

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200)
    this.faune.setVelocity(dir.x, dir.y)
  }

  update (t, dt) {
    if (!this.cursors.up || !this.faune) {
      return
    }

    const speed = 250
    if (this.cursors.left?.isDown) {
      this.lastKey = 'left'
      this.fauneAnim('run', 'left')
      this.faune.setVelocity(-speed, 0)
    } else if (this.cursors.right?.isDown) {
      this.lastKey = 'right'
      this.fauneAnim('run', 'right')
      this.faune.setVelocity(speed, 0)
    } else if (this.cursors.up?.isDown) {
      this.lastKey = 'up'
      this.fauneAnim('run', 'up')
      this.faune.setVelocity(0, -speed)
    } else if (this.cursors.down?.isDown) {
      this.lastKey = 'down'
      this.fauneAnim('run', 'down')
      this.faune.setVelocity(0, speed)
    } else {
      this.fauneAnim('idle', this.lastKey ?? 'down')
      this.faune.setVelocity(0, 0)
    }
  }

  fauneAnim (mode, direction) {
    this.faune.scaleX = direction === 'left' 
      ? -1 : 1

    if (direction === 'left') {
      this.faune.body.offset.x = 68
    } else {
      this.faune.body.offset.x = 30
    }

    const dir = direction === 'left' || direction === 'right'
      ? 'side'
      : direction
    this.faune.anims.play({
      key: `faune-${mode}-${dir}`,
      repeat: -1,
      frameRate: 15,
    }, true)
  }
}
