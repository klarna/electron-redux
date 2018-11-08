import { getIPCClient } from './nodeIpc';

const ipc = require('node-ipc');

export default function replayActionClient(namespace) {
  const ipcClient = getIPCClient(namespace);
  return (store) => {
    ipcClient.on('redux-action', (payload) => {
      if (payload.sender !== ipc.config.id) {
        store.dispatch(payload);
      }
    });
  };
}
