import validateAction from '../validateAction';

jest.unmock('../validateAction');
jest.unmock('../fluxStandardAction');

describe('validateAction', () => {
  it('should accept FSA-compliant actions', () => {
    const action = {
      type: 'TEST',
      payload: 123,
      meta: {
        foo: 'bar',
      },
    };
    expect(validateAction(action)).toBeTruthy();
  });

  it('should reject non-FSA-compliant actions', () => {
    expect(validateAction({})).toBeFalsy();
    expect(validateAction({ meta: {} })).toBeFalsy();
    expect(validateAction(() => {})).toBeFalsy();
    expect(validateAction([])).toBeFalsy();
  });
});
