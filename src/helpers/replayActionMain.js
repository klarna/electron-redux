import { ipcMain } from 'electron';

export default function replayActionMain(store) {
  ipcMain.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
