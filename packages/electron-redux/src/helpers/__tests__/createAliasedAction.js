import createAliasedAction from '../createAliasedAction';
import aliasRegistry from '../../registry/alias';

jest.unmock('../createAliasedAction');

describe('createAliasedAction', () => {
  it('should register the action in the registry', () => {
    const fn = jest.fn();
    createAliasedAction('some', fn);

    expect(aliasRegistry.set).toHaveBeenCalledTimes(1);
    expect(aliasRegistry.set).toHaveBeenCalledWith('some', fn);
  });

  it('should return the aliased action', () => {
    const fn = jest.fn();
    const actionCreator = createAliasedAction('some', fn);

    expect(actionCreator).toBeInstanceOf(Function);

    const action = actionCreator(1, 2);

    expect(action).toEqual({
      type: 'ALIASED',
      payload: [1, 2],
      meta: {
        trigger: 'some',
      },
    });
  });
});
