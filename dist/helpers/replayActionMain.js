'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replayActionMain;

var _electron = require('electron');

var transit = require('transit-immutable-js');

function replayActionMain(store) {

  console.log(transit.fromJSON(transit.toJSON(store.getState())));

  Object.defineProperty(global, 'reduxState', {
    get: function get() {
      return transit.toJSON(store.getState());
    },
    enumerable: true,
    configurable: false
  });

  _electron.ipcMain.on('redux-action', function (event, payload) {
    store.dispatch(payload);
  });
}