import 'whatwg-fetch';

import Form from '../Form';
import { STATUS as GAME_STATUSES } from '../../modules/GameController';

const EVENT_NAMESPACE = 'SymbolSelector:';

export default class SymbolSelector {
  constructor ({ formEl, symbolInputName, pubSub, config }) {
    this.pubSub = pubSub;

    this.form = new Form({ formEl });

    this.form.on('submit', (data) => this.submitSymbol(data[ symbolInputName ]));
    this.form.on('change', (data) => this.selectSymbol(data));

    this.pubSub.subscribe(
      'ConfigLoader:configLoaded',
      data => {
        let symbols = data.map(s => ({ label: s.name, value: s.id }));
        this.form.fillSelectWithOptions(symbolInputName, symbols);
      }
    );

    this.pubSub.subscribe(
      'GameController:statusChanged',
      status => {
        if (status === GAME_STATUSES.SELECTING) {
          this.form.enableInput('[name=symbol]');
          this.form.disableInput('[name=submit]');
        } else if (~[ GAME_STATUSES.WON, GAME_STATUSES.LOST ].indexOf(status)) {
          this.form.enableInput('[type=submit]');
        } else {
          this.form.disableInput('[type=submit]');
          this.form.disableInput('[name=symbol]');
        }
      }
    );

    if (config) {
      let symbols = config.map(s => ({ label: s.name, value: s.id }));
      this.form.fillSelectWithOptions(symbolInputName, symbols);
    }
  }

  on (event, handler, context) {
    event = EVENT_NAMESPACE + event;
    this.pubSub.subscribe(event, handler, context);
  }

  submitSymbol (symbol) {
    this.pubSub.publish(EVENT_NAMESPACE + 'submitted', symbol);
  }
  selectSymbol (symbol) {
    this.pubSub.publish(EVENT_NAMESPACE + 'selected', symbol);
    this.form.enableInput('[type=submit]');
  }
}
