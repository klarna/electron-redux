import { getIPCServer } from './nodeIpc';

const ipc = require('node-ipc');
const transit = require('transit-immutable-js');

export default function replayActionServer(namespace) {
  const ipcServer = getIPCServer(namespace);
  return (store) => {
    Object.defineProperty(global, 'reduxState', {
      get: () => transit.toJSON(store.getState()),
      enumerable: true,
      configurable: false,
    });

    ipcServer.on('redux-action', (payload, _socket) => {
      if (payload.sender !== ipc.config.id) {
        store.dispatch(payload);
      }
    });
  };
}
