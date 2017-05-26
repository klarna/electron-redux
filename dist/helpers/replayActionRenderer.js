'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replayActionRenderer;

var _electron = require('electron');

function replayActionRenderer(store) {
  _electron.ipcRenderer.on('redux-action', function (event, payload) {
    store.dispatch(payload);
  });
}