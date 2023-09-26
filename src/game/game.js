import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'
import GameUi from './scenes/GameUi'
import SecondScene from './scenes/SecondScene'

function launch(containerId) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: containerId,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {
          y: 0,
        },
        debug: true
      }
    },
    scene: [BootScene, PlayScene, SecondScene, GameUi]
  })
}

export default launch
export { launch }
