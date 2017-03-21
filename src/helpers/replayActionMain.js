import { ipcReceive } from 'electron-simple-ipc';

export default function replayActionMain(store) {
  // we have to do this to ease remote-loading of the initial state :(
  global.reduxState = store.getState();
  store.subscribe(() => {
    global.reduxState = store.getState();
  });

  ipcReceive('redux-action', store.dispatch);
}
