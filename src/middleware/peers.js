import rpcchannel from 'stream-json-rpc';

const transit = require('transit-immutable-js');

export default class Peers {
  constructor(firstConnectionHandler) {
    this.firstConnectionHandler = firstConnectionHandler;
    this.peers = new Set(); // List of clients
    this.handler = undefined;
  }

  handleNewConnections(store) {
    this.firstConnectionHandler((duplex) => {
      const channel = rpcchannel(duplex);
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
    });
  }

  broadcast(key, value) {
    this.peers.forEach(peer => peer.notify('redux-action', value));
  }

  setNotificationHandler(key, handler) {
    this.handler = [key, handler];
    this.peers.forEach(peer => peer.setNotificationHandler(key, handler(peer)));
  }
}
