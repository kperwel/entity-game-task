import GameLoop from '../modules/GameLoop';

import SymbolSelector from '../modules/SymbolSelector';
import AssetsManager from '../modules/AssetsManager';
import EntitiesManager from '../modules/EntitiesManager';
import GameController from '../modules/GameController';

import RenderComponent from '../components/RenderComponent';
import MoveComponent from '../components/MoveComponent';
import SymbolPresentationComponent from '../components/SymbolPresentationComponent';
import SymbolRandomizeComponent from '../components/SymbolRandomizeComponent';

export default class Game {
  constructor ({ pubSub, canvas, config }) {
    this.gameLoop = new GameLoop();

    this.size = {
      w: canvas.width(),
      h: canvas.height(),
      center: canvas.width() / 2 - 38
    };

    this.assetsManager = new AssetsManager({
      pubSub,
      assets: [ {
        id: 'symbol-indicator',
        path: '/app/images/arrow.png'
      }, {
        id: 'star',
        path: '/app/images/star.png'
      } ]
    });

    const entitiesManager = new EntitiesManager({
      pubSub
    });

    this.gameController = new GameController({
      config,
      pubSub,
      entitiesManager,
      size: this.size
    });

    this.symbolSelector = new SymbolSelector({
      config,
      pubSub,
      formEl: document.getElementById('game-settings'),
      symbolInputName: 'symbol'
    });

    this.components = {};
    this.initComponents({ pubSub, entitiesManager, canvas, size: this.size });

    pubSub.subscribe('ConfigLoader:configLoaded', (config) => {
      this.gameController.setConfig(config);
      config.forEach(({ id, path }) => {
        this.assetsManager.addToQueue(id, path);
      });
    }, this);

    this.init(config);
    this.registerComponents(this.components);
  }

  init (symbols) {
    if (symbols) {
      symbols.forEach(({ id, path }) => {
        this.assetsManager.addToQueue(id, path);
      });
    }
    this.gameLoop.start();
  }

  initComponents ({ pubSub, entitiesManager, canvas, size }) {
    this.components = {
      symbolPresentationComponent: new SymbolPresentationComponent({
        pubSub,
        entitiesManager,
        size
      }),
      symbolRandomizeComponent: new SymbolRandomizeComponent({
        pubSub,
        entitiesManager,
        size
      }),
      moveComponent: new MoveComponent({
        entitiesManager
      }),
      renderComponent: new RenderComponent({
        canvas,
        assetsManager: this.assetsManager,
        entitiesManager
      })
    };
  }

  registerComponents (components) {
    for (let component in components) {
      components[ component ].register(this.gameLoop);
    }
  }
}
