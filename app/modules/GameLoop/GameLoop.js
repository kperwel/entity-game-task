const STATE = {
  STOP: 0,
  PLAY: 1,
  PAUSE: 2
};

const fixedTimestep = 1000 / 60;

export default class GameLoop {
  constructor () {
    this.actions = [];
    this.fixedActions = [];

    this.lastTime = 0;
    this.status = STATE.STOP;
    this.delta = 0;
  }

  addAction (action, fixed) {
    if (fixed) {
      this.fixedActions.push(action);
    } else {
      this.actions.push(action);
    }
  }

  clear () {
    this.actions = [];
    this.fixedActions = [];
  }

  loop (time) {
    this.delta += time - this.lastTime;

    while (this.delta >= fixedTimestep) {
      this.makeFixedActions(fixedTimestep);
      this.delta -= fixedTimestep;
    }

    this.makeActions(this.lastTime - time);

    this.loopId = window.requestAnimationFrame(() => this.loop(
      this.status === STATE.PAUSE ? this.lastTime : performance.now()
    ));
    this.lastTime = time;
  }

  start () {
    this.status = STATE.PLAY;
    this.loop(performance.now());
  }

  stop () {
    this.status = STATE.STOP;
    window.cancelAnimationFrame(this.loopId);
  }

  makeActions (dt) {
    this.actions.forEach(action => action(dt));
  }

  makeFixedActions (dt) {
    this.fixedActions.forEach(action => action(dt));
  }

  pause () {
    this.status = STATE.PAUSE;
  }
}
