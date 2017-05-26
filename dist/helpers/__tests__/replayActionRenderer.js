'use strict';

var _electron = require('electron');

var _replayActionRenderer = require('../replayActionRenderer');

var _replayActionRenderer2 = _interopRequireDefault(_replayActionRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.unmock('../replayActionRenderer');

describe('replayActionRenderer', function () {
  it('should replay any actions received', function () {
    var store = {
      dispatch: jest.fn()
    };
    var payload = 123;

    (0, _replayActionRenderer2.default)(store);

    expect(_electron.ipcRenderer.on).toHaveBeenCalledTimes(1);
    expect(_electron.ipcRenderer.on.mock.calls[0][0]).toBe('redux-action');
    expect(_electron.ipcRenderer.on.mock.calls[0][1]).toBeInstanceOf(Function);

    var cb = _electron.ipcRenderer.on.mock.calls[0][1];
    cb('someEvent', payload);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });
});