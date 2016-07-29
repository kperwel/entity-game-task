import Scene from '../../modules/Scene';

export default class Win extends Scene {
  constructor ({ entitiesManager, pubSub, winningSymbol, size }) {
    super();
    this.entitiesManager = entitiesManager;

    this.text = {
      position: [ size.center - 145, size.h / 2 - 60 ],
      size: [ 0, 0 ],
      text: 'WINNER!',
      font: 'bold 50pt Arial',
      color: 'rgba(50, 255, 70, 1)',
      priority: 100
    };

    entitiesManager.add(this.text);
  }

  destroy () {
    this.entitiesManager.remove(this.text);
  }
}
