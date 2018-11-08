import { getIPCServer } from '../helpers/nodeIpc';

const transit = require('transit-immutable-js');

const forwardToClient = (namespace) => {
  const ipcServer = getIPCServer(namespace);

  return (store) => {
    ipcServer.on('client-ask-initial-state', (_, socket) => {
      ipcServer.emit(
        socket,
        'initial-state',
        transit.toJSON(store.getState()),
      );
    });

    return next => (action) => {
      if (action.meta && action.meta.scope === 'local') return next(action);
      // change scope to avoid endless-loop
      const rendererAction = {
        ...action,
        meta: {
          ...action.meta,
          scope: 'local',
        },
      };

      ipcServer.broadcast('redux-action', rendererAction);

      return next(action);
    };
  }
};

export default forwardToClient;
