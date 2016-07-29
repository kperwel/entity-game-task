/**
 * Controls main scene switching and game flow
 */

import * as scenes from '../../scenes';
import random from '../../utils/random';

const EVENTS_NAMESPACE = 'GameController:';

export const STATUS = {
  'LOADING': 0,
  'SELECTING': 1,
  'SWITCH': 2,
  'WON': 3,
  'LOST': 4
};

function getScene (status) {
  switch (status) {
    case STATUS.LOADING:
      return scenes.Loading;
    case STATUS.SWITCH:
      return scenes.Switching;
    case STATUS.WON:
      return scenes.Win;
    case STATUS.LOST:
      return scenes.Lost;
    default:
      return scenes.Selecting;
  }
}

export default class GameController {
  constructor ({ size, entitiesManager, pubSub, components, config }) {
    this.pubSub = pubSub;
    this.entitiesManager = entitiesManager;
    this.size = size;
    this.components = components;
    this.config = config;
    this.winningSymbol = null;

    this.setState(STATUS.LOADING);

    pubSub.subscribe('AssetsManager:ready', this.start, this);
    pubSub.subscribe('AssetsManager:loading', this.loading, this);
    pubSub.subscribe('SymbolSelector:submitted', this.switching, this);
    pubSub.subscribe('SymbolSelector:selected', this.selectSymbol, this);
    pubSub.subscribe('SymbolRandomizeComponent:stop', this.resolveGame, this);
  }

  setState (state) {
    const Scene = getScene(state);

    if (this.scene) {
      this.scene.destroy();
    }

    this.scene = new Scene({
      entitiesManager: this.entitiesManager,
      pubSub: this.pubSub,
      config: this.config,
      size: this.size,
      winningSymbol: this.winningSymbol
    });

    this.pubSub.publish(EVENTS_NAMESPACE + 'statusChanged', state);
    window.clearTimeout(this.delayedSwitch);
  }

  loading () {
    this.setState(STATUS.LOADING);
  }

  start () {
    this.entitiesManager.clear();
    this.setState(STATUS.SELECTING);
  }

  switching () {
    this.winningSymbol = this.config[random(0, this.config.length)]['id'];
    this.setState(STATUS.SWITCH);
  }

  resolveGame () {
    this.selectedSymbol === this.winningSymbol ? this.setState(STATUS.WON) : this.setState(STATUS.LOST);

    this.delayedSwitch = setTimeout(() => {
      this.start();
    }, 2000);
  }

  selectSymbol ({ symbol }) {
    this.selectedSymbol = symbol;
    let entities = this.entitiesManager.query([ 'selected' ]);

    entities.forEach(entity => {
      entity.selected = entity.id === symbol;
      entity.priority = entity.id === symbol ? 1 : 0;
    });
  }

  setConfig (config) {
    this.config = config;
  }
}
