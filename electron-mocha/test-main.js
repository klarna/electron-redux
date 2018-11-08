import { ipcMain, webContents } from 'electron';
import { applyMiddleware, createStore } from 'redux';
import replayActionMain from '../src/helpers/replayActionMain';
import forwardToRenderer from '../src/middleware/forwardToRenderer';
import reducer from './reducers';

const store = createStore(
  reducer,
  {},
  applyMiddleware(
    forwardToRenderer,
  ),
);

replayActionMain(store);

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
