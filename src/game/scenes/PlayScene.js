import { Scene } from 'phaser'

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
    this.physics.add.collider(this.faune, wallLayer)
    this.faune.body.setSize(this.faune.body.width * 0.4, this.faune.body.height * 0.5)
    this.faune.body.offset.y = 20

    // 슬라임 스폰
    this.slime = this.physics.add.sprite(250, 120, 'slime')
    this.physics.add.collider(this.slime, wallLayer)
    this.slime.body.setSize(this.slime.body.width, this.slime.body.height)
    

    // 카메라 팔로잉
    this.cameras.main.startFollow(this.faune, true)
  }

  update (t, dt) {
    if (!this.cursors.up || !this.faune) {
      return
    }

    this.slime.anims.play({
      key: 'slime_idle',
      repeat: -1,
      frameRate: 15,
      duration: 100
    }, true)

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
      this.fauneAnim('idle', this.lastKey)
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
