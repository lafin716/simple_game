import Phaser from "phaser"

export const Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
  STOP: 4,
}

export const randomDirection = (exclude) => {
  let newDir = Phaser.Math.Between(0, 4)
  while (newDir === exclude) {
    newDir = Phaser.Math.Between(0, 4)
  }

  return newDir
}