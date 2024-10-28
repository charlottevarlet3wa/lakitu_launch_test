export default class Slingshot extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, width = 100, height = 20) {
    super(scene, x, y, width, height, 0x000000); // Barre noire
    scene.add.existing(this);
  }
}
