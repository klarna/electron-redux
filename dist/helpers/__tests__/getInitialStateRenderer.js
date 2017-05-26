'use strict';

var _electron = require('electron');

var _getInitialStateRenderer = require('../getInitialStateRenderer');

var _getInitialStateRenderer2 = _interopRequireDefault(_getInitialStateRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.unmock('../getInitialStateRenderer');

describe('getInitialStateRenderer', function () {
  it('should return the initial state', function () {
    _electron.remote.getGlobal.mockImplementation(function () {
      return 456;
    });

    expect((0, _getInitialStateRenderer2.default)()).toBe(456);
  });
});