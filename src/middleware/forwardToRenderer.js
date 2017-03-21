import { ipcSend } from 'electron-simple-ipc';
import validateAction from '../helpers/validateAction';

const forwardToRenderer = () => next => (action) => {
  if (!validateAction(action)) return next(action);

  // change scope to avoid endless-loop
  const rendererAction = {
    ...action,
    meta: {
      ...action.meta,
      scope: 'local',
    },
  };

  ipcSend('redux-action', rendererAction);

  return next(action);
};

export default forwardToRenderer;
