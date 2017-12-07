import { ipcRenderer } from 'electron';

export default function replayActionRenderer(store) {
  ipcRenderer.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
