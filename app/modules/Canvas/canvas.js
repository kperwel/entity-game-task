import PubSub from '../../utils/PubSub';

export default class Canvas extends PubSub {
  constructor ({ el }) {
    super();
    this.el = el;
    this.ctx = el.getContext('2d');
  }

  on (event, handler, context) {
    this.subscribe(event, handler, context);
  }

  drawImage (image, x, y, w, h, alpha) {
    if (alpha !== undefined) {
      this.ctx.globalAlpha = alpha;
    }
    this.ctx.drawImage(image, x - w / 2, y - h / 2, w, h);
    if (alpha !== undefined) {
      this.ctx.globalAlpha = 1;
    }
  }

  fillText (text, x, y, color, font) {
    this.ctx.fillStyle = color || 'rgba(200, 0, 200, 1)';
    this.ctx.font = font || '48px serif';
    this.ctx.fillText(text, x, y);
  }

  drawRectangle (x, y, w, h, color) {
    this.ctx.fillStyle = color || 'rgba(0, 0, 200, 0.5)';
    this.ctx.fillRect(x - w / 2, y - h / 2, w, h);
  }

  clear () {
    this.ctx.clearRect(0, 0, this.width(), this.height());
  }

  height () {
    return this.el.height;
  }

  width () {
    return this.el.width;
  }
}
