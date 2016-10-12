import alias from '../alias';

jest.unmock('../alias');

describe('alias', () => {
  describe('#set', () => {
    it('should set a value', () => {
      alias.set('abc', 123);
    });
  });

  describe('#get', () => {
    it('should get a value', () => {
      alias.set('abc', 123);
      expect(alias.get('abc')).toEqual(123);
    });
  });
});
