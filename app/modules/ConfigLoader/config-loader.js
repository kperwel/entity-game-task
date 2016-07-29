import { checkStatus as checkStatus } from '../../utils/http';
import 'whatwg-fetch';
import Form from '../Form';

const EVENT_NAMESPACE = 'ConfigLoader:';

export default class ConfigLoader {
  constructor ({ formEl, configInputName, pubSub }) {
    this.pubSub = pubSub;
    this.configInputName = configInputName;

    let form = new Form({ formEl });

    form.on('submit', (data) => this.fetchConfig(data));
  }

  fetchConfig (data) {
    fetch(data[ this.configInputName ]).then(
      checkStatus
    ).then(
      response => response.json()
    ).then(
      json => this.onSuccess(json)
    ).catch(
      err => this.onError(err)
    );
  }

  on (event, handler, context) {
    event = EVENT_NAMESPACE + event;
    this.pubSub.subscribe(event, handler, context);
  }

  onSuccess (config) {
    this.pubSub.publish(EVENT_NAMESPACE + 'configLoaded', config);
  }

  onError (error) {
    window.alert(error.response.statusText);
  }
}
