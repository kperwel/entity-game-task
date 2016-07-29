export function serialize (form) {
  let values = {};
  for (let el in [].slice.call(form.elements)) {
    if (!form.elements[ el ].name || !form.elements[ el ].value) {
      continue;
    }

    values[ form.elements[ el ].name ] = form.elements[ el ].value;
  }
  return values;
}
