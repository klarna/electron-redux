import forwardToServer from '../forwardToServer';

describe('forwardToServer', () => {
  it('should pass an action through if it starts with @@', () => {
    const next = jest.fn();
    const peer = {
      notify: jest.fn(),
    };
    const action = { type: '@@SOMETHING' };

    forwardToServer(peer)()(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next).toBeCalledWith(action);
    expect(peer.notify.mock.calls.length).toBe(0);
  });

  it('should pass an action through if it starts with redux-form', () => {
    const next = jest.fn();
    const peer = {
      notify: jest.fn(),
    };
    const action = { type: 'redux-form' };

    forwardToServer(peer)()(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next).toBeCalledWith(action);
    expect(peer.notify.mock.calls.length).toBe(0);
  });

  it('should pass an action through if the scope is local', () => {
    const next = jest.fn();
    const peer = {
      notify: jest.fn(),
    };
    const action = {
      type: 'MY_ACTION',
      meta: {
        scope: 'local',
      },
    };

    forwardToServer(peer)()(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next).toBeCalledWith(action);
    expect(peer.notify.mock.calls.length).toBe(0);
  });

  it('should forward any actions to the main process', () => {
    const next = jest.fn();
    const peer = {
      notify: jest.fn(),
    };
    const action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
        webContentsId: 1,
      },
    };

    forwardToServer(peer)()(next)(action);

    expect(peer.notify.mock.calls.length).toBe(1);
    expect(peer.notify).toBeCalledWith('redux-action', action);
  });
});
