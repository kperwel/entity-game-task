/**
 * Used mostly for smooth moving elements (small Euler method for )
 */
export default class MoveComponent {
  constructor ({ entitiesManager }) {
    this.entitiesManager = entitiesManager;
  }

  update (dt) {
    this.entitiesManager.query([ 'position', 'velocity' ]).forEach(
      entity => {
        [0, 1].forEach(d => {
          entity.position[d] += entity.velocity[d] * dt;
        });
      }
    );
  }

  register (gameLoop) {
    gameLoop.addAction((dt) => this.update(dt), true);
  }
}
