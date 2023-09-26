import Phaser from 'phaser'
import { sceneEvents } from '../events/EventCenter'

const HealthStatus = {
  IDLE: 0,
  DAMAGE: 1,
  DEAD: 2,
}

export default class Player extends Phaser.Physics.Arcade.Sprite {

  _speed = 150
  _healthStatus = HealthStatus.IDLE
  _damageTime = 0
  _health = 3
  _chest = null
  _coins = 0

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)

  }

  get _health() {
    return this._health
  }

  setChest(chest) {
    this._chest = chest
  }

  handleDamage(dir) {
    if (this._health <= 0) {
      return
    }

    if (this._healthStatus === HealthStatus.DAMAGE) {
      return
    }

    --this._health
    if (this._health <= 0) {
      this._healthStatus = HealthStatus.DEAD
      this.anims.play('faune-die-side')
      
    } else {
      this.setVelocity(dir.x, dir.y)
      this.setTint(0xff0000)
      this._healthStatus = HealthStatus.DAMAGE
    }
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
      case HealthStatus.DEAD:
        this.setTint(0xffffff)
    }
  }

  update(cursors) {
    if (!cursors.up 
      || this._healthStatus === HealthStatus.DAMAGE
      || this._healthStatus === HealthStatus.DEAD
    ) {
      return
    }

    // 상자 열기
    if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
      if (this._chest) {
        this._coins += this._chest.open()
        sceneEvents.emit('player-coins-changed', this._coins)
      }

      return
    }

    // 이동키 매핑
    if (cursors.left?.isDown) {
      this.lastKey = 'left'
      this.fauneAnim('run', 'left')
      this.setVelocity(-this._speed, 0)
      this._chest = null
    } else if (cursors.right?.isDown) {
      this.lastKey = 'right'
      this.fauneAnim('run', 'right')
      this.setVelocity(this._speed, 0)
      this._chest = null
    } else if (cursors.up?.isDown) {
      this.lastKey = 'up'
      this.fauneAnim('run', 'up')
      this.setVelocity(0, -this._speed)
      this._chest = null
    } else if (cursors.down?.isDown) {
      this.lastKey = 'down'
      this.fauneAnim('run', 'down')
      this.setVelocity(0, this._speed)
      this._chest = null
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
  sprite.setScale(0.1, 0.6)

  this.displayList.add(sprite)
  this.updateList.add(sprite)
  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)
  sprite.body.setSize(sprite.body.width * 4, sprite.body.height * 0.7)
  sprite.body.offset.y = 20
  sprite.body.offset.x = 20

  return sprite
})