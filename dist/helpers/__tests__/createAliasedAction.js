'use strict';

var _createAliasedAction = require('../createAliasedAction');

var _createAliasedAction2 = _interopRequireDefault(_createAliasedAction);

var _alias = require('../../registry/alias');

var _alias2 = _interopRequireDefault(_alias);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.unmock('../createAliasedAction');

describe('createAliasedAction', function () {
  it('should register the action in the registry', function () {
    var fn = jest.fn();
    (0, _createAliasedAction2.default)('some', fn);

    expect(_alias2.default.set).toHaveBeenCalledTimes(1);
    expect(_alias2.default.set).toHaveBeenCalledWith('some', fn);
  });

  it('should return the aliased action', function () {
    var fn = jest.fn();
    var actionCreator = (0, _createAliasedAction2.default)('some', fn);

    expect(actionCreator).toBeInstanceOf(Function);

    var action = actionCreator(1, 2);

    expect(action).toEqual({
      type: 'ALIASED',
      payload: [1, 2],
      meta: {
        trigger: 'some'
      }
    });
  });
});