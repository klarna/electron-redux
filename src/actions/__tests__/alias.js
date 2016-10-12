import { ALIASED } from '../alias';

jest.unmock('../alias');

describe('alias', () => {
  it('should return the ALIASED action type', () => {
    expect(ALIASED).toBe('ALIASED');
  });
});
