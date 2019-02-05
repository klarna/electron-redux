import rpcchannel from 'stream-json-rpc';

const transit = require('transit-immutable-js');

export default class Peers {
  constructor(ipcServer, ServerDuplexClass) {
    this.ipcServer = ipcServer;
    this.ServerDuplexClass = ServerDuplexClass;
    this.peers = new Set(); // List of clients
    this.handler = undefined;
  }

  handleNewConnections(store) {
    const firstConnection = (_data, socket) => {
      const channel = rpcchannel(new this.ServerDuplexClass(this.ipcServer, socket));
      const peer = channel.peer('electron-redux-peer');
      peer.setRequestHandler('client-ask-initial-state', () => transit.toJSON(store.getState()));

      this.peers.add(peer);

      if (this.handler) {
        const [key, handler] = this.handler;
        peer.setNotificationHandler(key, handler(peer));
      }

      peer.on('end', () => {
        this.peers.remove(peer);
      });

      this.ipcServer.off('data', firstConnection);
    };
    this.ipcServer.on('data', firstConnection);
  }

  broadcast(key, value) {
    this.peers.forEach(peer => peer.notify('redux-action', value));
  }

  setNotificationHandler(key, handler) {
    this.handler = [key, handler];
    this.peers.forEach(peer => peer.setNotificationHandler(key, handler(peer)));
  }
}
