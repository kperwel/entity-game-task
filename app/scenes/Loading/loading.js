import Scene from '../../modules/Scene';

export default class Loading extends Scene {
  constructor ({ entitiesManager, pubSub, size }) {
    super();
    this.size = size;
    this.entitiesManager = entitiesManager;
    pubSub.subscribe('AssetsManager:progress', this.progress, this);

    this.progressBar = {
      size: [20, 50],
      position: [ this.size.center, this.size.h / 2 ]
    };

    this.entitiesManager.add(this.progressBar);
  }

  progress (data) {
    this.progressBar.size[0] = data.finished.length / (data.finished.length + data.loading.length) * this.size.w;
  }

  destroy () {
    this.entitiesManager.remove(this.progressBar);
  }
}
