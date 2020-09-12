import { webContents } from 'electron';
import validateAction from '../helpers/validateAction';

const forwardToRenderer = () => (next) => (action) => {
  if (!validateAction(action)) return next(action);
  if (action.meta && action.meta.scope === 'local') return next(action);

  // change scope to avoid endless-loop
  const rendererAction = {
    ...action,
    meta: {
      ...action.meta,
      scope: 'local',
    },
  };

  const allWebContents = webContents.getAllWebContents();

  allWebContents.forEach((contents) => {
    if (contents.getURL().startsWith('devtools://')) return;
    contents.executeJavaScript('window.electronReduxId').then((id) => {
      if (action.meta.id !== id || !id) {
        contents.send('redux-action', rendererAction);
      }
    });
  });

  return next(action);
};

export default forwardToRenderer;
