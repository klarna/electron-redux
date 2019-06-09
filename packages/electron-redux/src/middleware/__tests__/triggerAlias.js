import triggerAlias from '../triggerAlias';
import aliasRegistry from '../../registry/alias';

jest.unmock('../triggerAlias');
jest.unmock('../../helpers/expandAliasedAction');

describe('triggerAlias', () => {
  it('should pass an action through if not ALIAS', () => {
    const next = jest.fn();
    const action = { type: 'SOMETHING' };
    triggerAlias()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should trigger an alias action', () => {
    const next = jest.fn();
    const payload = [123];
    const action = {
      type: 'MY_ACTION',
      payload: 'awesome',
    };
    const trigger = jest.fn(() => action);
    const aliasedAction = {
      type: 'ALIASED',
      payload,
      meta: {
        trigger: 'MY_ACTION',
      },
    };

    aliasRegistry.get.mockImplementation(() => trigger);

    triggerAlias()(next)(aliasedAction);

    expect(trigger).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveBeenCalledWith(...payload);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should trigger an alias action without payload', () => {
    const next = jest.fn();
    const action = {
      type: 'MY_ACTION',
      payload: 'awesome',
    };
    const trigger = jest.fn(() => action);
    const aliasedAction = {
      type: 'ALIASED',
      meta: {
        trigger: 'MY_ACTION',
      },
    };

    aliasRegistry.get.mockImplementation(() => trigger);

    triggerAlias()(next)(aliasedAction);

    expect(trigger).toHaveBeenCalledTimes(1);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should throw an error when no meta defined', () => {
    const next = jest.fn();
    const payload = [123];
    const action = {
      type: 'MY_ACTION',
      payload: 'awesome',
    };
    const trigger = jest.fn(() => action);
    const aliasedAction = {
      type: 'ALIASED',
      payload,
    };

    aliasRegistry.get.mockImplementation(() => trigger);

    expect(() => {
      triggerAlias()(next)(aliasedAction);
    }).toThrowError('No trigger defined');
  });

  it('should throw an error when no trigger defined', () => {
    const next = jest.fn();
    const payload = [123];
    const action = {
      type: 'MY_ACTION',
      payload: 'awesome',
    };
    const trigger = jest.fn(() => action);
    const aliasedAction = {
      type: 'ALIASED',
      payload,
      meta: {},
    };

    aliasRegistry.get.mockImplementation(() => trigger);

    expect(() => {
      triggerAlias()(next)(aliasedAction);
    }).toThrowError('No trigger defined');
  });

  it('should throw an error when trigger alias not defined', () => {
    const next = jest.fn();
    const payload = [123];
    const aliasedAction = {
      type: 'ALIASED',
      payload,
      meta: {
        trigger: 'MY_OTHER_ACTION',
      },
    };

    aliasRegistry.get.mockImplementation(() => undefined);

    expect(() => {
      triggerAlias()(next)(aliasedAction);
    }).toThrowError('Trigger alias MY_OTHER_ACTION not found');
  });
});
