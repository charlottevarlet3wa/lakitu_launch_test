export default class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = "ball", radius = 13) {
    super(scene, x, y, texture); // Charge le sprite de la balle
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Définit un cercle de collision
    this.setOrigin(0.5, 0.5);
    // this.body.setCircle(radius); // Rayon pour le corps circulaire
    this.body.setCircle(radius, 9, 10);

    this.body.setAllowGravity(false); // Désactive la gravité au début

    // Initialise la propriété isScored pour empêcher le score d'être incrémenté plusieurs fois
    this.isScored = false;
    this.isLaunched = false; // Initialement, la balle n'est pas lancée

    this.isDescending = false;

    // Propriétés spécifiques à la balle
    this.initialPosition = new Phaser.Math.Vector2(x, y); // Enregistre la position initiale
    this.maxDragDistance = 200; // Distance maximale de déplacement en `x` et `y`
    this.maxVelocity = this.maxDragDistance * 9; // Limite de vélocité maximale

    // Définit la balle comme interactive pour le drag
    this.setInteractive();
    scene.input.setDraggable(this);
  }

  launch(startPoint, endPoint) {
    const launchVelocity = startPoint.clone().subtract(endPoint).scale(3);

    // Limite la vélocité maximale
    launchVelocity.x = Phaser.Math.Clamp(
      launchVelocity.x,
      -this.maxVelocity,
      this.maxVelocity
    );
    launchVelocity.y = Phaser.Math.Clamp(
      launchVelocity.y,
      -this.maxVelocity,
      this.maxVelocity
    );

    // Active la gravité après le lancement
    this.body.setAllowGravity(true);
    this.body.setVelocity(launchVelocity.x, launchVelocity.y);
    this.isLaunched = true; // Marque la balle comme lancée
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // Vérifie si la balle commence à descendre
    if (this.body.velocity.y > 0) {
      this.isDescending = true;
    }
  }

  limitDragPosition(dragX, dragY) {
    // Limite le déplacement `x` et `y` pour ne pas dépasser maxDragDistance
    const minX = this.initialPosition.x - this.maxDragDistance;
    const maxX = this.initialPosition.x + this.maxDragDistance;
    const minY = this.initialPosition.y - this.maxDragDistance;
    const maxY = this.initialPosition.y + this.maxDragDistance;

    // Limite les valeurs directement sans retourner d'objet
    this.x = Phaser.Math.Clamp(dragX, minX, maxX);
    this.y = Phaser.Math.Clamp(dragY, minY, maxY);
  }

  isOutOfBounds(width, height) {
    return this.y > height || this.x < 0 || this.x > width;
  }
}
