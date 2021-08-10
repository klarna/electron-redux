import { ipcRenderer } from 'electron';

export default function getInitialStateRenderer() {
  const reduxState = ipcRenderer.sendSync('get-redux-state');
  if (!reduxState) {
    throw new Error(
      'Could not find reduxState global in main process, did you forget to call replayActionMain?',
    );
  }
  return JSON.parse(reduxState);
}
