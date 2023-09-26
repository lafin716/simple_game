import Phaser from "phaser";

const ChestStatus = {
  CLOSE: 0,
  EMPTY: 1,
}

export default class Chest extends Phaser.Physics.Arcade.Sprite {

  _status = ChestStatus.CLOSE

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame)
    this.play('chest-close')
  }

  coins() {
    if (this._status !== ChestStatus.CLOSE) {
      return 0
    }

    return Phaser.Math.Between(50, 200)
  }

  open() {
    if (this._status === ChestStatus.EMPTY) {
      this.play('chest-empty')
      return 0
    }

    const coin = this.coins()
    this.play('chest-open')
    this._status = ChestStatus.EMPTY
    return coin
  }
}