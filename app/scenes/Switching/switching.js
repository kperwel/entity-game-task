import Scene from '../../modules/Scene';
import random from '../../utils/random';

export default class Switching extends Scene {
  constructor ({ entitiesManager, pubSub, winningSymbol, size }) {
    super();
    this.pubSub = pubSub;
    this.entitiesManager = entitiesManager;

    let entities = entitiesManager.query([ 'id' ]);

    let winKey = entities.findIndex(e => e.id === winningSymbol);
    let rotations = random(4, 8);

    entities.forEach((entity, i) => {
      entity.randomize = {
        targetRotation: (i - winKey) * 2 * Math.PI / entities.length - Math.PI / 2 + Math.PI,
        rotation: rotations * Math.PI,
        speed: 0.01
      };
      delete entity.presentInCircle;
    });

    this.switcherIndicator = {
      position: [size.center, size.h / 2],
      size: [ 512, 128 ],
      texture: 'symbol-indicator'
    };
    entitiesManager.add(this.switcherIndicator);
  }

  destroy () {
    this.entitiesManager.remove(this.switcherIndicator);
  }
}
