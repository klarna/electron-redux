import { BrowserWindow } from 'electron';

const forwardToRenderer = () => next => (action) => {
  // change scope to avoid endless-loop
  const rendererAction = {
    ...action,
    meta: {
      ...action.meta,
      scope: 'local',
    },
  };

  const openWindows = BrowserWindow.getAllWindows();
  openWindows.forEach(({ webContents }) => {
    if (webContents.isDestroyed() || webContents.isCrashed()) return;
    // Skip the webcontents source of the action because it has already been applied.
    // This avoids breaking sync dispatch.
    if (action.meta && webContents.id === action.meta.webContentsId) return;
    webContents.send('redux-action', rendererAction);
  });

  return next(action);
};

export default forwardToRenderer;
