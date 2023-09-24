

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, character) {
    super(scene, x, y, character)

    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)
    this.setOrigin(0)
    
  }

  
}