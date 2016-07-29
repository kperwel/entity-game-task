export default class SymbolRandomizeComponent {
  constructor ({ entitiesManager, size, pubSub }) {
    this.entitiesManager = entitiesManager;
    this.pubSub = pubSub;
    this.size = size;
    this.radius = 200;
    this.lastRotatingEntities = 0;
  }

  update (dt) {
    let entities = this.entitiesManager.query([ 'randomize', 'position' ]);

    if (entities.length === 0 && this.lastRotatingEntities !== 0) {
      this.pubSub.publish('SymbolRandomizeComponent:stop');
      this.lastRotatingEntities = 0;
      return;
    } else if (entities.length === 0) {
      return;
    }

    entities.forEach(entity => {
      entity.priority = Math.sin(
        entity.randomize.targetRotation + entity.randomize.rotation
      );

      entity.alpha = entity.priority + 1;
      entity.position[ 0 ] = this.size.center;
      entity.position[ 1 ] = this.size.h / 2 + this.radius * Math.cos(
        entity.randomize.targetRotation + entity.randomize.rotation
      );

      if (entity.randomize.rotation < Math.PI && entity.randomize.speed > 0.0001) {
        entity.randomize.speed /= 1.05;
      }

      if (entity.randomize.rotation > 0) {
        entity.randomize.rotation -= dt * entity.randomize.speed;
      } else {
        entity.randomize.rotation = 0;
        delete entity.randomize;
      }
    });

    this.lastRotatingEntities = entities.length;
  }

  register (gameLoop) {
    gameLoop.addAction((dt) => this.update(dt), true);
  }
}
