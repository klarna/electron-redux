import { ipcMain } from 'electron';

const transit = require('transit-immutable-js');

export default function replayActionMain(store) {

  Object.defineProperty(global, 'reduxState', {
    get: () => transit.toJSON(store.getState()),
    enumerable: true,
    configurable: false,
  });

  ipcMain.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
