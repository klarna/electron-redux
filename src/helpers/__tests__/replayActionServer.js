import replayActionServer from '../replayActionServer';

describe('replayActionServer', () => {
  it('should replay any actions received', () => {
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
    };
    const peers = {
      setNotificationHandler: jest.fn(),
    };
    const payload = 123;

    replayActionServer(peers)(store);

    expect(peers.setNotificationHandler).toHaveBeenCalledTimes(1);
    expect(peers.setNotificationHandler.mock.calls[0][0]).toBe('redux-action');
    expect(peers.setNotificationHandler.mock.calls[0][1]).toBeInstanceOf(Function);

    const cb = peers.setNotificationHandler.mock.calls[0][1];
    cb('someEvent', payload);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });
});
