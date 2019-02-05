import forwardToClients from '../forwardToClients';

describe('forwardToClient', () => {
  it('should pass an action through to the main store', () => {
    const next = jest.fn();
    const peers = {
      handleNewConnections: jest.fn(),
      broadcast: jest.fn(),
    };
    const action = {
      type: 'SOMETHING',
      meta: {
        scope: 'local',
      },
    };

    forwardToClients(peers)()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toBeCalledWith(action);
    expect(peers.broadcast).toHaveBeenCalledTimes(0);
  });

  it('should forward any actions to the renderer', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
      },
    };
    const peers = {
      handleNewConnections: jest.fn(),
      broadcast: jest.fn(),
    };

    forwardToClients(peers)()(next)(action);

    expect(peers.broadcast).toHaveBeenCalledTimes(1);
    expect(peers.broadcast).toBeCalledWith('redux-action', {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
        scope: 'local',
      },
    });
    expect(peers.broadcast).toHaveBeenCalledTimes(1);
  });
});
