export const TYPES = {
  IMAGE: 0,
  TEXT: 1,
  PARTICLE: 2
};

export default class Entity {
  constructor ({ position, velocity, size, texture, type }) {
    this.type = type || TYPES.IMAGE;

    this.position = position;
    this.size = size;
    this.velocity = velocity;
    this.texture = texture;
  }
}
