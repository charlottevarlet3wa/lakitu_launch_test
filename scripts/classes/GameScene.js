import Slingshot from "./Slingshot.js";
import Ball from "./Ball.js";
import Platform from "./Platform.js";
import Score from "./Score.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.startPoint = new Phaser.Math.Vector2();
    this.endPoint = new Phaser.Math.Vector2();
    this.isDragging = false;
  }

  preload() {
    this.load.image("ball", "assets/images/ball.png");
    this.load.image("greenPlatform", "assets/images/platformBlue.png");
    this.load.image("redPlatform", "assets/images/platformRed.png");
  }

  create() {
    this.score = new Score(this, 16, 16);
    this.slingshot = new Slingshot(this, 400, 350);

    // Initialise un groupe de physique pour les balles
    this.balls = this.physics.add.group({
      allowGravity: false, // Force les balles dans le groupe à ignorer la gravité par défaut
    });

    // Créez un groupe statique pour les plateformes
    this.platforms = this.physics.add.staticGroup();

    // Ajoutez les plateformes au groupe
    this.platformLeft = new Platform(this, 100, 400, "greenPlatform");
    this.platformRight = new Platform(this, 500, 400, "redPlatform");
    this.platforms.add(this.platformLeft);
    this.platforms.add(this.platformRight);
    this.platformLeft2 = new Platform(this, 500, 400, "greenPlatform");
    this.platformRight2 = new Platform(this, 100, 400, "redPlatform");
    this.platforms.add(this.platformLeft2);
    this.platforms.add(this.platformRight2);

    this.spawnBall();

    this.physics.add.overlap(
      this.balls,
      this.platforms,
      this.handleBallPlatformCollision,
      null,
      this
    );

    // Gestion des événements de drag
    this.input.on("dragstart", (pointer, gameObject) => {
      if (gameObject === this.ball) {
        this.isDragging = true;
        this.startPoint.set(pointer.x, pointer.y);
        this.ball.body.setVelocity(0, 0);
        this.ball.body.setAllowGravity(false);
      }
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if (gameObject === this.ball && this.isDragging) {
        this.ball.limitDragPosition(dragX, dragY);
      }
    });

    this.input.on("dragend", (pointer, gameObject) => {
      if (gameObject === this.ball) {
        this.isDragging = false;
        this.endPoint.set(pointer.x, pointer.y);
        this.ball.launch(this.startPoint, this.endPoint);
        this.spawnBall();
      }
    });
  }

  update() {
    this.balls.children.each((ball) => {
      if (ball.isOutOfBounds(this.scale.width, this.scale.height)) {
        ball.destroy();
      }
    });
  }

  spawnBall() {
    this.ball = new Ball(this, 400, 330, "ball");
    this.ball.body.setAllowGravity(false);
    this.balls.add(this.ball); // Ajoute la balle au groupe de balles
  }

  handleBallPlatformCollision(ball, platform) {
    if (!ball.isScored && ball.isLaunched && ball.isDescending) {
      console.log("Collision avec la plateforme", platform.texture.key);

      ball.isScored = true;
      this.score.increment();

      this.time.delayedCall(50, () => {
        ball.destroy();
      });
    }
  }
}
