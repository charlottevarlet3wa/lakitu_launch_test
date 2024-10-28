export default class Platform extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, color = 0x00ff00) {
    super(scene, x, y, 150, 20, color); // Taille de la plateforme
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Plateforme statique (mais animée)

    this.tolerance = 10; // Tolérance pour la détection de collision
    this.initialY = y; // Position de départ en Y
    this.scene = scene;

    // Tween pour mouvement horizontal permanent (aller-retour)
    scene.tweens.add({
      delay: Phaser.Math.Between(500, 5000),
      targets: this,
      x: x + 200, // Distance horizontale du mouvement
      duration: 5000, // Durée en ms
      yoyo: true, // Retourne au point de départ
      repeat: -1, // Mouvement infini
      ease: "Sine.easeInOut",
    });

    // Appelle un mouvement vertical de temps en temps
    this.startVerticalMovement();
  }

  startVerticalMovement() {
    // Déclenche un mouvement vertical aléatoire toutes les 15 à 20 secondes
    this.scene.time.addEvent({
      delay: Phaser.Math.Between(1000, 2000), // Délai aléatoire en ms
      callback: () => {
        // Calcule une nouvelle position Y en fonction de la plateforme (coulissante vers le haut/bas)
        let newY;
        // Si la plateforme est verte
        //   newY = this.y === 50 ? 300 : 50; // Alterne entre 50 et 300
        newY = Phaser.Math.Between(50, 500); // Alterne entre 50 et 300

        // Tween pour un mouvement vertical lissé
        this.scene.tweens.add({
          targets: this,
          y: newY,
          duration: 4000,
          ease: "Sine.easeInOut",
          onComplete: () => {
            this.startVerticalMovement(); // Relance le mouvement vertical aléatoire
          },
        });
      },
      callbackScope: this,
      loop: false, // Ne boucle pas immédiatement pour éviter d'empiler les événements
    });
  }

  checkBallCollision(ball) {
    const ballBottom = ball.y + ball.displayHeight / 2;
    const platformTop = this.y - this.height / 2;

    const ballCenterX = ball.x;
    const platformLeft = this.x - this.width / 2;
    const platformRight = this.x + this.width / 2;

    // Vérifie si la balle descend et est en contact avec la plateforme en x et y
    if (
      ballBottom >= platformTop - this.tolerance &&
      ballBottom <= platformTop + this.tolerance &&
      ballCenterX >= platformLeft &&
      ballCenterX <= platformRight &&
      ball.body.velocity.y > 0
    ) {
      console.log("Collision detected");
      this.isHovered = true;
      return true;
    }

    this.isHovered = false;
    return false;
  }

  isBallFullyOnPlatform(ball) {
    const ballLeft = ball.x - ball.displayWidth / 2;
    const ballRight = ball.x + ball.displayWidth / 2;
    const platformLeft = this.x - this.width / 2;
    const platformRight = this.x + this.width / 2;

    // Vérifie si la balle est entièrement sur la plateforme avec tolérance
    return (
      ballLeft >= platformLeft + this.tolerance &&
      ballRight <= platformRight - this.tolerance
    );
  }
}
