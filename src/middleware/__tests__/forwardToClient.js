import forwardToClient from '../forwardToClient';

jest.unmock('../forwardToClient');

describe('forwardToClient', () => {
  it('should pass an action through to the main store', () => {
    const next = jest.fn();
    const peers = {
      handleNewConnections: jest.fn(),
      broadcast: jest.fn(),
    };
    const action = { type: 'SOMETHING' };

    forwardToClient(peers)(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next).toBeCalledWith(action);
    expect(peers.broadcast.mock.calls.length).toBe(1);
    expect(peers.broadcast).toBeCalledWith(action);
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

    forwardToClient()(next)(action);

    expect(peers.broadcast.mock.calls.length).toBe(1);
    expect(peers.broadcast).toBeCalledWith('redux-action', {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
        scope: 'local',
      },
    });
  });
});
