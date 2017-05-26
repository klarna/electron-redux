'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _electron = require('electron');

var forwardToRenderer = function forwardToRenderer() {
  return function (next) {
    return function (action) {
      // change scope to avoid endless-loop
      var rendererAction = _extends({}, action, {
        meta: _extends({}, action.meta, {
          scope: 'local'
        })
      });

      var openWindows = _electron.BrowserWindow.getAllWindows();
      openWindows.forEach(function (_ref) {
        var webContents = _ref.webContents;

        webContents.send('redux-action', rendererAction);
      });

      return next(action);
    };
  };
};

exports.default = forwardToRenderer;