export default class SymbolPresentationComponent {
  constructor ({ entitiesManager, size }) {
    this.entitiesManager = entitiesManager;
    this.shift = 0;
    this.radius = size.w;
    this.size = size;
  }

  update (dt) {
    this.shift += 0.001 * dt;
    this.entitiesManager.query([ 'presentInCircle', 'selected' ]).forEach(
      entity => {
        const { numOfSymbols, i, takeDown } = entity.presentInCircle;
        const { selected } = entity;

        if (this.radius > this.size.w / 5 && !takeDown) {
          this.radius -= 0.1 * dt;
        }
        if (this.radius < 500 && takeDown) {
          this.radius += 0.1 * dt;
        }

        entity.position = [
          this.size.center + this.radius * Math.cos((this.shift + i) * 360 / numOfSymbols * Math.PI / 180),
          this.size.h / 2 + this.radius * Math.sin((this.shift + i) * 360 / numOfSymbols * Math.PI / 180)
        ];

        if (selected) {
          [0, 1].forEach(d => {
            entity.size[d] += entity.size[d] < entity.baseSize[d] * 0.7 ? (entity.size[d] / 100) * dt : 0;
          });
        } else {
          [0, 1].forEach(d => {
            entity.size[d] += entity.size[d] > entity.baseSize[d] * 0.5 ? -(entity.size[d] / 100) * dt : 0;
          });
        }
      }
    );
  }

  register (gameLoop) {
    gameLoop.addAction((dt) => this.update(dt), true);
  }
}
