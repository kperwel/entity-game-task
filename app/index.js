import './styles/main.scss';
import Game from './Game';
import defaultConfig from './symbols.json';

import ConfigLoader from './modules/ConfigLoader';
import Canvas from './modules/Canvas';
import PubSub from './utils/PubSub';

const pubSub = new PubSub();
const canvas = new Canvas({
  el: document.getElementById('game')
});

const game = new Game({
  config: defaultConfig,
  pubSub,
  canvas
});

game.init(defaultConfig);

const configLoader = new ConfigLoader({
  pubSub,
  formEl: document.getElementById('config-loader'),
  configInputName: 'configPath'
});

configLoader.on('loaded', () => console.info('Config successfully loaded!'));
