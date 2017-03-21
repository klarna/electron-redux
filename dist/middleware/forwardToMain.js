'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _electronSimpleIpc = require('electron-simple-ipc');

var _validateAction = require('../helpers/validateAction');

var _validateAction2 = _interopRequireDefault(_validateAction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var forwardToMain = function forwardToMain(store) {
  return function (next) {
    return function (action) {
      // eslint-disable-line no-unused-vars
      if (!(0, _validateAction2.default)(action)) return next(action);

      if (action.type.substr(0, 2) !== '@@' && action.type.substr(0, 10) !== 'redux-form' && (!action.meta || !action.meta.scope || action.meta.scope !== 'local')) {
        (0, _electronSimpleIpc.ipcSend)('redux-action', action);

        // stop action in-flight
        // eslint-disable-next-line consistent-return
        return;
      }

      // eslint-disable-next-line consistent-return
      return next(action);
    };
  };
};

exports.default = forwardToMain;