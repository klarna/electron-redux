import { ipcRenderer, remote } from 'electron';

let webContentsId = null; // lazy loaded

const forwardToMain = store => next => (action) => { // eslint-disable-line no-unused-vars
  if (typeof action === 'function') return next(action);
  if (
    (action.type.substr(0, 2) !== '@@' || action.type.substr(0, 10) === '@@redux-ui')
    && action.type.substr(0, 10) !== 'redux-form'
    && (
      !action.meta
      || !action.meta.scope
      || action.meta.scope !== 'local'
    )
  ) {
    if (webContentsId === null) {
      try {
        webContentsId = remote.getCurrentWebContents().id;
      } catch (e) {
        // Catches the following error that can be emitted if current
        // webcontents is in instance of destruction:
        // Uncaught Error: Cannot get property 'id' on missing remote object
        return next(action);
      }
    }
    const newAction = {
      ...action,
      meta: {
        ...action.meta,
        webContentsId,
      },
    };
    ipcRenderer.send('redux-action', newAction);

    return next(newAction);
  }

  return next(action);
};

export default forwardToMain;
