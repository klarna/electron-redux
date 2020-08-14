import createAliasedAction from '../createAliasedAction';
import expandAliasedAction from '../expandAliasedAction';

jest.unmock('../../registry/alias');
jest.unmock('../createAliasedAction');
jest.unmock('../expandAliasedAction');

describe('expandAliasedAction', () => {
  const aliasedAction = createAliasedAction('TEST', () => action);

  it('expands aliased action', () => {
    const action = { type: 'TEST' };
    const actionCreator = () => action;
    const aliasedAction = createAliasedAction('TEST', actionCreator);
    expect(expandAliasedAction(aliasedAction())).toEqual(action);
  });

  it('expands aliased action forwarding arguments', () => {
    const action = { type: 'TEST', payload: { foo: 'bar' } };
    const actionCreator = payload => ({ type: 'TEST', payload });
    const aliasedAction = createAliasedAction('TEST', actionCreator);
    expect(expandAliasedAction(aliasedAction({ foo: 'bar' }))).toEqual(action);
  });

  it('throws an error if no metadata is found', () => {
    const action = { type: 'TEST' };
    expect(() => expandAliasedAction(action)).toThrowError('No trigger defined');
  });

  it('throws an error if no metadata trigger is found', () => {
    const action = { type: 'TEST', meta: {} };
    expect(() => expandAliasedAction(action)).toThrowError('No trigger defined');
  });

  it('throws an error if no alias is found for given metadata trigger', () => {
    const action = { type: 'TEST', meta: { trigger: 'DOES_NOT_EXIST' } };
    expect(() => expandAliasedAction(action)).toThrowError(
      `Trigger alias DOES_NOT_EXIST not found`,
    );
  });
});
