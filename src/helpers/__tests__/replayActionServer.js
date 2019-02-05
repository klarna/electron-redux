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
    const payload = {
      sender: 1,
      value: 123,
    };

    replayActionServer(peers)(store);

    expect(peers.setNotificationHandler).toHaveBeenCalledTimes(1);
    expect(peers.setNotificationHandler.mock.calls[0][0]).toBe('redux-action');
    expect(peers.setNotificationHandler.mock.calls[0][1]).toBeInstanceOf(Function);

    const cb = peers.setNotificationHandler.mock.calls[0][1];

    cb({ id: 1 })(payload);
    expect(store.dispatch).toHaveBeenCalledTimes(0);

    cb({ id: 2 })(payload);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });
});
