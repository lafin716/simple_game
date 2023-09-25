import Phaser from "phaser"

const Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
}

const randomDirection = (exclude) => {
  let newDir = Phaser.Math.Between(0, 3)
  while (newDir === exclude) {
    newDir = Phaser.Math.Between(0, 3)
  }

  return newDir
}

export default class Slime extends Phaser.Physics.Arcade.Sprite {

  _direction = Direction.RIGHT
  _moveEvent = Phaser.Time.TimerEvent

  constructor(
    scene,
    x,
    y,
    texture, 
    frame  
  ) {
    super(scene, x, y, texture, frame)
    this.anims.play({
      key: 'slime_idle',
      repeat: -1
    }, true)

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE, 
      this.handleTileCollision)

    this._moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this._direction = randomDirection(this._direction)
      },
      loop: true
    })
  }

  handleTileCollision(go, tile) {
    if (go !== this) {
      return
    }

    this._direction = randomDirection(this._direction)
  }

  destroy(fromScene) {
    this._moveEvent.destroy()
    super.destroy(fromScene)
  }

  preUpdate(time, dtime) {
    super.preUpdate(time, dtime)
    const speed = 50

    this.anims.play({
      key: 'slime_jump',
      repeat: -1
    }, true)

    switch(this._direction) {
      case Direction.UP:
        this.scaleX = 1
        this.body.offset.x = 0
        this.setVelocity(0, -speed)
        break
      case Direction.DOWN:
        this.scaleX = 1
        this.body.offset.x = 0
        this.setVelocity(0, speed)
        break
      case Direction.LEFT:
        this.scaleX = -1
        this.body.offset.x = 30
        this.setVelocity(-speed, 0)
        break
      case Direction.RIGHT:
        this.scaleX = 1
        this.body.offset.x = 0
        this.setVelocity(speed, 0)
        break
    
    }
  }

}