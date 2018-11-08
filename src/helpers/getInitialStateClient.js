import { getIPCClient } from './nodeIpc';

const transit = require('transit-immutable-js');

export default function getInitialStateClient(namespace) {
  const ipcClient = getIPCClient(namespace);

  return new Promise((resolve) => {
    ipcClient.on('initial-state', (payload) => {
      resolve(transit.fromJSON(payload));
    });
    ipcClient.emit('client-ask-initial-state');
  });
}
