import { ipcMain, webContents } from 'electron';
import { applyMiddleware, createStore } from 'redux';
import { firstConnectionHandler, getServer } from 'stream-node-ipc';
import replayActionServer from '../src/helpers/replayActionServer';
import forwardToClients from '../src/middleware/forwardToClients';
import Peers from '../src/middleware/peers';
import reducer from './reducers';

const ipcServer = getServer('getstation-electron-redux-test');
const peers = new Peers(callback => firstConnectionHandler(ipcServer, callback));

const store = createStore(
  reducer,
  {},
  applyMiddleware(
    forwardToClients(peers),
  ),
);

replayActionServer(peers)(store);

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
