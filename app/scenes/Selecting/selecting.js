import Scene from '../../modules/Scene';

export default class Selecting extends Scene {
  constructor ({ entitiesManager, pubSub, config }) {
    super();
    this.pubSub = pubSub;
    this.entitiesManager = entitiesManager;
    let length = config.length;

    config.forEach((symbol, i) => {
      entitiesManager.add({
        id: symbol.id,
        texture: symbol.id,
        selected: false,
        velocity: [0, 0],
        presentInCircle: {
          numOfSymbols: length,
          takeDown: false,
          i
        },
        size: [ 235 * 0.5, 155 * 0.5 ],
        baseSize: [ 235, 155 ]
      });
    });
  }

  destroy () {
    this.entitiesManager.query([ 'presentInCircle' ]).forEach(entity => {
      if (!entity.selected) {
        entity.presentInCircle.takeDown = true;
      }
    });
  }
}
