import { ipcMain, webContents } from 'electron';
import { applyMiddleware, createStore } from 'redux';
import replayActionServer from '../src/helpers/replayActionServer';
import forwardToClient from '../src/middleware/forwardToClient';
import reducer from './reducers';

const namespace = 'getstation-electron-redux-test';

const store = createStore(
  reducer,
  {},
  applyMiddleware(
    forwardToClient(namespace),
  ),
);

replayActionServer(namespace)(store);

ipcMain.on('test:dispatch-from-main', () => {
  store.dispatch({
    type: 'test2',
  });
});

store.subscribe(() => {
  webContents.getAllWebContents().forEach((wc) => {
    wc.send('test:reply-from-main', store.getState());
  });
});
