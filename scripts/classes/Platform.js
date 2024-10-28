export default class Platform extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Créé comme un objet statique

    this.tolerance = 10;
    this.initialY = y;
    this.scene = scene;

    // Définir un tween pour le mouvement horizontal
    scene.tweens.add({
      delay: Phaser.Math.Between(500, 5000),
      targets: this,
      x: x + 200,
      duration: 5000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      onUpdate: () => {
        this.body.updateFromGameObject(); // Synchronise la box de collision
      },
    });

    // Définir un tween pour le mouvement vertical
    this.startVerticalMovement();
  }

  startVerticalMovement() {
    this.scene.time.addEvent({
      delay: Phaser.Math.Between(1000, 2000),
      callback: () => {
        let newY = Phaser.Math.Between(50, 500);
        this.scene.tweens.add({
          targets: this,
          y: newY,
          duration: 4000,
          ease: "Sine.easeInOut",
          onUpdate: () => {
            this.body.updateFromGameObject(); // Synchronise la box de collision
          },
          onComplete: () => this.startVerticalMovement(),
        });
      },
      callbackScope: this,
      loop: false,
    });
  }
}
