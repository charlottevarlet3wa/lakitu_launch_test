export default class Score {
  constructor(scene, x = 16, y = 16, initialScore = 0) {
    this.scene = scene;
    this.score = initialScore;

    // Création de l'élément texte pour afficher le score
    this.scoreText = this.scene.add.text(x, y, `Score: ${this.score}`, {
      fontSize: "24px",
      fill: "#ffffff",
    });
  }

  increment(value = 1) {
    // Incrémente le score et met à jour le texte
    this.score += value;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  reset() {
    // Remet le score à zéro et met à jour le texte
    this.score = 0;
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
