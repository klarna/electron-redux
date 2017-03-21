import { ipcReceive } from 'electron-simple-ipc';

export default function replayActionRenderer(store) {
  ipcReceive('redux-action', store.dispatch);
}
