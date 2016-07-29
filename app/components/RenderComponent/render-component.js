function sortByPriority (a, b) {
  if (!a.priority && !b.priority) {
    return -1;
  } else if (!a.priority) {
    return -1;
  } else if (!a.priority) {
    return 1;
  } else if (a.priority === b.priority) {
    return 0;
  } else {
    return a.priority < b.priority ? -1 : 1;
  }
}

export default class GameRenderer {
  constructor ({ canvas, entitiesManager, assetsManager }) {
    this.canvas = canvas;
    this.assetsManager = assetsManager;
    this.entitiesManager = entitiesManager;
  }

  render () {
    this.canvas.clear();
    this.entitiesManager.query([ 'position', 'size' ]).sort(sortByPriority).forEach(
      ({ position, size, texture, alpha, text, color, font }) => {
        let img = texture && this.assetsManager.getAsset(texture);
        if (img) {
          this.canvas.drawImage(
            img, position[ 0 ], position[ 1 ], size[ 0 ], size[ 1 ], alpha
          );
        } else if (text) {
          this.canvas.fillText(
            text, position[ 0 ], position[ 1 ], color, font
          );
        } else {
          this.canvas.drawRectangle(
            position[ 0 ], position[ 1 ], size[ 0 ], size[ 1 ], color
          );
        }
      }
    );
  }

  register (gameLoop) {
    gameLoop.addAction((dt) => this.render(dt), false);
  }
}
