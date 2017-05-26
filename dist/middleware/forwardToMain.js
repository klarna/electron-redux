'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _electron = require('electron');

var forwardToMain = function forwardToMain(store) {
  return function (next) {
    return function (action) {
      // eslint-disable-line no-unused-vars
      if (typeof action === 'function') return next(action);
      if (action.type.substr(0, 2) !== '@@' && action.type.substr(0, 10) !== 'redux-form' && (!action.meta || !action.meta.scope || action.meta.scope !== 'local')) {
        _electron.ipcRenderer.send('redux-action', action);

        // stop action in-flight
        // eslint-disable-next-line consistent-return
        // return;
      }

      // eslint-disable-next-line consistent-return
      return next(action);
    };
  };
};

exports.default = forwardToMain;