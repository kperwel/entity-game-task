import { serialize as serializeForm } from '../../utils/forms';
import PubSub from '../../utils/PubSub';

function createOptions (label, value, { disabled, selected }) {
  var opt = document.createElement('option');
  opt.innerHTML = label;
  opt.value = value;
  opt.disabled = !!disabled;
  opt.selected = !!selected;
  return opt;
}

export default class Form extends PubSub {
  constructor ({ formEl }) {
    super();

    this.formEl = formEl;
    this.registerEvents();
  }

  fillSelectWithOptions (selectName, options) {
    let select = this.formEl.querySelector('select[name=' + selectName + ']');
    select.innerHTML = '';
    select.appendChild(createOptions('Choose symbol', '', { disabled: true, selected: true }));
    options.forEach(o => select.appendChild(createOptions(o.label, o.value, {})));
  }

  enableInput (selector) {
    let input = this.formEl.querySelector(selector);
    if (input) {
      input.disabled = false;
    }
  }

  disableInput (selector) {
    let input = this.formEl.querySelector(selector);
    if (input) {
      input.disabled = true;
    }
  }

  registerEvents () {
    this._onSubmit = (ev) => {
      ev.preventDefault();
      if (ev.target === this.formEl) {
        this.publish('submit', serializeForm(this.formEl));
      }
    };
    this._onChange = (ev) => {
      ev.preventDefault();
      if (this.formEl.contains(ev.target)) {
        this.publish(
          'change',
          {
            [ ev.target.name ]: serializeForm(this.formEl)[ ev.target.name ]
          }
        );
      }
    };
    document.addEventListener('submit', this._onSubmit);
    document.addEventListener('change', this._onChange);
  }

  unregisterEvents () {
    this.document.removeEventListener('submit', this._onSubmit);
    this.document.removeEventListener('change', this._onChange);
  }

  on (event, handler, context) {
    this.subscribe(event, handler, context);
  }
}
