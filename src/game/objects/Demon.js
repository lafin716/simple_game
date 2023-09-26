import Phaser from "phaser"
import { Direction, randomDirection } from "@/game/consts/move"

export default class Demon extends Phaser.Physics.Arcade.Sprite {

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
      key: 'demon-idle',
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

    if (this._direction === Direction.STOP) {
      this.anims.play({
        key: 'demon-idle',
        repeat: -1
      }, true)
    } else {
      this.anims.play({
        key: 'demon-run',
        repeat: -1
      }, true)
    }

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
      case Direction.STOP:
        this.scaleX = 1
        this.body.offset.x = 0
        this.setVelocity(0, 0)
        break
    }
  }

}