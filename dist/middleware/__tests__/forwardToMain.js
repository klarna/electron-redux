'use strict';

var _electron = require('electron');

var _forwardToMain = require('../forwardToMain');

var _forwardToMain2 = _interopRequireDefault(_forwardToMain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.unmock('../forwardToMain');

describe('forwardToMain', function () {

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