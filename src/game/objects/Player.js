import Phaser from 'phaser'


const HealthStatus = {
  IDLE: 0,
  DAMAGE: 1,

}

export default class Player extends Phaser.Physics.Arcade.Sprite {

  _healthStatus = HealthStatus.IDLE
  _damageTime = 0

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

  }

  handleDamage(dir) {
    if (this._healthStatus === HealthStatus.DAMAGE) {
      return
    }

    this.setVelocity(dir.x, dir.y)
    this.setTint(0xff0000)
    this._healthStatus = HealthStatus.DAMAGE
  }

  preUpdate(t, dt) {
    super.preUpdate(t, dt)
    switch (this._healthStatus) {
      case HealthStatus.IDLE:
        break
      case HealthStatus.DAMAGE:
        this._damageTime += dt
        if (this._damageTime >= 250) {
          this._healthStatus = HealthStatus.IDLE
          this.setTint(0xffffff)
          this._damageTime = 0
        }
        break
    }
  }

  update(cursors) {
    if (!cursors.up || this._healthStatus === HealthStatus.DAMAGE) {
      return
    }

    const speed = 250
    if (cursors.left?.isDown) {
      this.lastKey = 'left'
      this.fauneAnim('run', 'left')
      this.setVelocity(-speed, 0)
    } else if (cursors.right?.isDown) {
      this.lastKey = 'right'
      this.fauneAnim('run', 'right')
      this.setVelocity(speed, 0)
    } else if (cursors.up?.isDown) {
      this.lastKey = 'up'
      this.fauneAnim('run', 'up')
      this.setVelocity(0, -speed)
    } else if (cursors.down?.isDown) {
      this.lastKey = 'down'
      this.fauneAnim('run', 'down')
      this.setVelocity(0, speed)
    } else {
      this.fauneAnim('idle', this.lastKey ?? 'down')
      this.setVelocity(0, 0)
    }
  }

  fauneAnim (mode, direction) {
    this.scaleX = direction === 'left' 
      ? -1 : 1

    if (direction === 'left') {
      this.body.offset.x = 68
    } else {
      this.body.offset.x = 30
    }

    const dir = direction === 'left' || direction === 'right'
      ? 'side'
      : direction
    this.anims.play({
      key: `faune-${mode}-${dir}`,
      repeat: -1,
      frameRate: 15,
    }, true)
  }
}

Phaser.GameObjects.GameObjectFactory.register('faune', function (x, y, texture, frame) {
  var sprite = new Player(this.scene, x, y, texture, frame)

  this.displayList.add(sprite)
  this.updateList.add(sprite)
  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
  sprite.body.setSize(sprite.body.width * 0.4, sprite.body.height * 0.5)
  sprite.body.offset.y = 20

  return sprite
})