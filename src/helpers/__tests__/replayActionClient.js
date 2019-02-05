import replayActionClient from '../replayActionClient';

describe('replayActionClient', () => {
  it('should replay any actions received', () => {
    const store = {
      dispatch: jest.fn(),
    };
    const peer = {
      setNotificationHandler: jest.fn(),
    };
    const payload = {
      sender: 1,
      value: 123,
    };

    replayActionClient(peer)(store);

    expect(peer.setNotificationHandler).toHaveBeenCalledTimes(1);
    expect(peer.setNotificationHandler.mock.calls[0][0]).toBe('redux-action');
    expect(peer.setNotificationHandler.mock.calls[0][1]).toBeInstanceOf(Function);

    const cb = peer.setNotificationHandler.mock.calls[0][1];
    cb(payload);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });
});
