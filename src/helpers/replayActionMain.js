import { ipcMain } from 'electron';

export default function replayActionMain(store) {
  // we have to do this to ease remote-loading of the initial state :(
  global.reduxState = store.getState();
  store.subscribe(() => {
    global.reduxState = store.getState();
  });

  ipcMain.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
