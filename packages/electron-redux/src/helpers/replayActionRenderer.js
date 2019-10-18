const { ipcRenderer } =
  typeof window != 'undefined' ? window.require('electron') : require('electron');

export default function replayActionRenderer(store) {
  ipcRenderer.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
