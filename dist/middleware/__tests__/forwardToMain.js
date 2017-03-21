'use strict';

var _electron = require('electron');

var _forwardToMain = require('../forwardToMain');

var _forwardToMain2 = _interopRequireDefault(_forwardToMain);

var _validateAction = require('../../helpers/validateAction');

var _validateAction2 = _interopRequireDefault(_validateAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.unmock('../forwardToMain');

describe('forwardToMain', function () {
  beforeEach(function () {
    _validateAction2.default.mockReturnValue(true);
  });

  it('should pass an action through if it doesn\'t pass validation (FSA)', function () {
    var next = jest.fn();
    // thunk action
    var action = function action() {};
    _validateAction2.default.mockReturnValue(false);

    (0, _forwardToMain2.default)()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should pass an action through if it starts with @@', function () {
    var next = jest.fn();
    var action = { type: '@@SOMETHING' };

    (0, _forwardToMain2.default)()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should pass an action through if it starts with redux-form', function () {
    var next = jest.fn();
    var action = { type: 'redux-form' };

    (0, _forwardToMain2.default)()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should pass an action through if the scope is local', function () {
    var next = jest.fn();
    var action = {
      type: 'MY_ACTION',
      meta: {
        scope: 'local'
      }
    };

    (0, _forwardToMain2.default)()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should forward any actions to the main process', function () {
    var next = jest.fn();
    var action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta'
      }
    };

    (0, _forwardToMain2.default)()(next)(action);

    expect(_electron.ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(_electron.ipcRenderer.send).toHaveBeenCalledWith('redux-action', action);

    expect(next).toHaveBeenCalledTimes(0);
  });
});