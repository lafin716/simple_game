import Phaser from "phaser";
import { sceneEvents } from "../events/EventCenter";

export default class GameUi extends Phaser.Scene {

  constructor() {
    super({key: 'GameUi'})
  }

  create() {
    // 돈 표시
    const coinLabel = this.add.text(5, 30, '0')

    sceneEvents.on('player-coins-changed', (coin) => {
      coinLabel.text = coin
    }, this)

    // 체력 표시
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image
    })
    this.hearts.createMultiple({
      key: 'ui-heart-full',
      setXY: {
        x: 10,
        y: 10,
        stepX: 16
      },
      quantity: 3
    })

    sceneEvents.on('player-health-changed', this.handlePlayerHealthChanged, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off('player-health-changed', this.handlePlayerHealthChanged)
      sceneEvents.off('player-coins-changed')
    })
  }

  handlePlayerHealthChanged(health) {
    this.hearts.children.each((go, index) => {
      if (index < health) {
        go.setTexture('ui-heart-full')
      } else {
        go.setTexture('ui-heart-empty')
      }
    })
  }
}

