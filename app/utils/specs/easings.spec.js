import { easeInOutQuad } from '../easings';

describe('easings', () => {
  it('easeInOutQuad should be negative for bigger numbers', () => {
    expect(easeInOutQuad(3)).toBe(-7);
  });
  it('easeInOutQuad should be positive for small value', () => {
    expect(easeInOutQuad(0.3)).toBe(0.18);
  });
});
