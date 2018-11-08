const memoize = require('lodash.memoize');
const ipc = require('node-ipc');
const shortid = require('shortid');

export const getIPCServer = memoize((namespace) => {
  ipc.config.appspace = namespace;
  ipc.config.id = 'server';
  ipc.config.silent = true;
  ipc.config.retry = 1000;
  ipc.serve(() => {});
  ipc.server.start();
  return ipc.server;
});

export const getIPCClient = memoize((namespace) => {
  ipc.config.appspace = namespace;
  ipc.config.id = `client-${shortid.generate()}`;
  ipc.config.silent = true;
  ipc.config.retry = 1000;
  ipc.connectTo('server', () => {});
  return ipc.of.server;
});
