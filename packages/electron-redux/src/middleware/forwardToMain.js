import { ipcRenderer } from 'electron';
import validateAction from '../helpers/validateAction';

const forwardToMain = store => next => (action) => { // eslint-disable-line no-unused-vars
  if (!validateAction(action)) return next(action);

  if (
    action.type.substr(0, 2) !== '@@'
    && action.type.substr(0, 10) !== 'redux-form'
    && (
      !action.meta
      || !action.meta.scope
      || action.meta.scope !== 'local'
    )
  ) {
    ipcRenderer.send('redux-action', action);

    // stop action in-flight
    // eslint-disable-next-line consistent-return
    return;
  }

  // eslint-disable-next-line consistent-return
  return next(action);
};

export default forwardToMain;
