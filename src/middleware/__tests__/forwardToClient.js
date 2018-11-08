import { BrowserWindow } from 'electron';
import forwardToClient from '../forwardToClient';

jest.unmock('../forwardToClient');

describe('forwardToClient', () => {
  it('should pass an action through to the main store', () => {
    const next = jest.fn();
    const action = { type: 'SOMETHING' };

    forwardToClient()(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next).toBeCalledWith(action);
  });

  it('should forward any actions to the renderer', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
      },
    };
    const send = jest.fn(() => {});
    const isDestroyed = jest.fn(() => false);
    const isCrashed = jest.fn(() => false);
    BrowserWindow.getAllWindows.mockImplementation(() => [
      {
        webContents: {
          id: 1,
          send,
          isDestroyed,
          isCrashed,
        },
      },
    ]);

    forwardToClient()(next)(action);

    expect(send.mock.calls.length).toBe(1);
    expect(send).toBeCalledWith('redux-action', {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
        scope: 'local',
      },
    });
  });
});
