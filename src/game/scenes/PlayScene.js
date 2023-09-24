import { Scene } from 'phaser'

export default class PlayScene extends Scene {

  constructor () {
    super({ key: 'PlayScene' })
  }

  preload() { 
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create () {
    // 카메라 설정
    // this.cameras.main.setOrigin(0)


    const scale = 4
    const backgroundPosition = { x: 0, y: 0 }
    const playerPosition = { x: 480, y: 200 }
    
    // 맵 생성
    // this.add.image(
    //   backgroundPosition.x,
    //   backgroundPosition.y, 
    //   'tiles')
    const map = this.make.tilemap( {key: 'dungeon'} )
    const tileset = map.addTilesetImage('dungeon', 'tiles')

    map.createLayer('Ground', tileset)
    const wallLayer = map.createLayer('Wall', tileset)

    // 충돌 설정
    wallLayer.setCollisionByProperty({ collides: true })

    const debugGraphicsLayer = this.add.graphics().setAlpha(0.7)
    wallLayer.renderDebug(debugGraphicsLayer, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    })

    // 캐릭터 설정
    this.faune = this.physics.add.sprite(120, 120, 'faune', 'faune-idle-down')
    this.physics.add.collider(this.faune, wallLayer)
    this.faune.body.setSize(this.faune.body.width * 0.4, this.faune.body.height * 0.5)
    this.faune.body.offset.y = 20
    this.cameras.main.startFollow(this.faune, true)
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
