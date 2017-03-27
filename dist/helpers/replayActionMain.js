'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replayActionMain;

var _electronSimpleIpc = require('electron-simple-ipc');

function replayActionMain(store) {
  // we have to do this to ease remote-loading of the initial state :(
  global.reduxState = store.getState();
  global.reduxStateStringified = JSON.stringify(store.getState());
  store.subscribe(function () {
    global.reduxState = store.getState();
    global.reduxStateStringified = JSON.stringify(store.getState());
  });

  (0, _electronSimpleIpc.ipcReceive)('redux-action', store.dispatch);
}