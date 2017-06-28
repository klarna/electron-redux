'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replayActionRenderer;

var _electronSimpleIpc = require('electron-simple-ipc');

function replayActionRenderer(store) {
  (0, _electronSimpleIpc.ipcReceive)('redux-action', store.dispatch);
}