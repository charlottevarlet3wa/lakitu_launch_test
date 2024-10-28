import Slingshot from "./Slingshot.js";
import Ball from "./Ball.js";
import Platform from "./Platform.js";
import Score from "./Score.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.balls = []; // Tableau pour stocker les balles
    this.startPoint = new Phaser.Math.Vector2();
    this.endPoint = new Phaser.Math.Vector2();
    this.isDragging = false;
  }

  preload() {
    // Charger l'image de la balle
    this.load.image("ball", "path/to/ball.png"); // Remplacez par le chemin correct
  }

  create() {
    // Initialisation du score
    this.score = new Score(this, 16, 16);

    // Création du lance-pierre
    this.slingshot = new Slingshot(this, 400, 350);

    // Création des plateformes
    this.platformLeft = new Platform(this, 100, 400, 0x00ff00); // Plateforme verte
    this.platformRight = new Platform(this, 500, 400, 0xff0000); // Plateforme rouge

    // Création de la première balle
    this.spawnBall();

    // Gestion des événements de drag
    this.input.on("dragstart", (pointer, gameObject) => {
      if (gameObject === this.ball) {
        this.isDragging = true;
        this.startPoint.set(pointer.x, pointer.y);
        this.ball.body.setVelocity(0, 0);
        this.ball.body.setAllowGravity(false); // Geler la balle
      }
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if (gameObject === this.ball && this.isDragging) {
        // Limite la position `x` et `y` en fonction de la distance maximale
        this.ball.limitDragPosition(dragX, dragY);
      }
    });

    this.input.on("dragend", (pointer, gameObject) => {
      if (gameObject === this.ball) {
        this.isDragging = false;
        this.endPoint.set(pointer.x, pointer.y);
        this.ball.launch(this.startPoint, this.endPoint); // Lancer la balle
        this.spawnBall(); // Crée une nouvelle balle
      }
    });

    // Ajout d'un écouteur pour la touche 'W'
    this.input.keyboard.on("keydown-W", () => {
      this.displayBallsInfo();
    });
  }

  update() {
    this.balls = this.balls.filter((ball) => {
      if (ball.isOutOfBounds(this.scale.width, this.scale.height)) {
        ball.destroy();
        return false; // Exclut la balle du tableau si elle est hors des limites
      }

      // Vérifier les collisions avec les plateformes
      this.checkPlatformCollision(ball, this.platformLeft);
      this.checkPlatformCollision(ball, this.platformRight);

      return true;
    });
  }

  spawnBall() {
    this.ball = new Ball(this, 400, 330, "ball"); // Utilise l'image de la balle
    this.balls.push(this.ball); // Ajoute la balle au tableau
  }

  checkPlatformCollision(ball, platform) {
    // Vérifie que la balle n'a pas déjà été marquée comme scorée
    if (!ball.isScored && platform.checkBallCollision(ball)) {
      if (platform.isBallFullyOnPlatform(ball)) {
        console.log("on");

        // Désactive temporairement le corps de la balle pour éviter d'autres collisions
        ball.body.enable = false;
        ball.isScored = true; // Marque la balle comme scorée
        // ball.body.setBounce(2); // Léger rebond

        // Utilise un délai pour supprimer la balle après la logique de collision
        this.time.delayedCall(100, () => {
          ball.destroy(); // Supprime la balle après un court délai
          this.score.increment(); // Incrémente le score une seule fois
        });
      } else {
        // La balle touche seulement le bord de la plateforme
        ball.body.setBounce(0.2); // Léger rebond
      }
    }
  }

  displayBallsInfo() {
    console.log("Positions des balles existantes :");
    this.balls.forEach((ball, index) => {
      console.log(`Balle ${index + 1}: x=${ball.x}, y=${ball.y}`);
    });
  }
}
