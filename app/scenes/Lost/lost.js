import Scene from '../../modules/Scene';

export default class Lost extends Scene {
  constructor ({ entitiesManager, size }) {
    super();
    this.entitiesManager = entitiesManager;

    this.text = {
      position: [ size.center - 160, size.h / 2 - 60 ],
      size: [0, 0],
      text: 'Try again!',
      font: 'bold 50pt Arial',
      color: 'rgba(255, 50, 70, 1)',
      priority: 100
    };

    entitiesManager.add(this.text);
  }

  destroy () {
    this.entitiesManager.remove(this.text);
  }
}
