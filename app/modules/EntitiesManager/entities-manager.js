export default class EntitiesManager {
  constructor ({ pubSub }) {
    this.pubSub = pubSub;
    this.entities = [];
  }

  clear () {
    this.entities = [];
  }

  add (entity) {
    this.entities.push(entity);
  }

  // TODO: Optimize query and storing entities
  query (dependencies) {
    let result = this.entities.filter(e => (
      dependencies.every(d => ~Object.keys(e).indexOf(d))
    ));

    return result;
  }

  remove (entity) {
    let index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }
}
