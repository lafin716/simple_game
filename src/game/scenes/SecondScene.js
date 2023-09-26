import { Scene } from 'phaser'

export default class SecondScene extends Scene {
  constructor () {
    super({ key: 'SecondScene' })
  }

  preload() { 
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  create () {
    // 게임 UI 로드
    this.scene.run('GameUi')
    
    // 맵 생성
    const map = this.make.tilemap( {key: 'second'} )
    const tileset = map.addTilesetImage('second', 'tiles2')
    map.createLayer('Ground', tileset)
    const wallLayer = map.createLayer('Wall', tileset)
    wallLayer.setCollisionByProperty({ collides: true })

    // 캐릭터 스폰
    this.faune = this.add.faune(120, 120, 'faune')
    this.faune.setWeapon(this._weapons)

    // 카메라 팔로잉
    this.cameras.main.setZoom(3,3)
    this.cameras.main.startFollow(this.faune, true)
  }

  update (t, dt) {
    if (this.faune) {
      this.faune.update(this.cursors)
    }
  }
}