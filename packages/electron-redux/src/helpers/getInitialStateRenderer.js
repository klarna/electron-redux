const { remote } = typeof window != 'undefined' ? window.require('electron') : require('electron');

export default function getInitialStateRenderer() {
  const getReduxState = remote.getGlobal('getReduxState');
  if (!getReduxState) {
    throw new Error(
      'Could not find reduxState global in main process, did you forget to call replayActionMain?',
    );
  }
  return JSON.parse(getReduxState());
}
