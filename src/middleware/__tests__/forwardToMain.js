import { ipcRenderer } from 'electron';
import forwardToMain from '../forwardToMain';

jest.unmock('../forwardToMain');

describe('forwardToMain', () => {
  it('should pass an action through if it starts with @@', () => {
    const next = jest.fn();
    const action = { type: '@@SOMETHING' };

    forwardToMain()(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next).toBeCalledWith(action);
  });

  it('should pass an action through if it starts with redux-form', () => {
    const next = jest.fn();
    const action = { type: 'redux-form' };

    forwardToMain()(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next).toBeCalledWith(action);
  });

  it('should pass an action through if the scope is local', () => {
    const next = jest.fn();
    const action = {
      type: 'MY_ACTION',
      meta: {
        scope: 'local',
      },
    };

    forwardToMain()(next)(action);

    expect(next.mock.calls.length).toBe(1);
    expect(next).toBeCalledWith(action);
  });

  it('should forward any actions to the main process', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
        webContentsId: 1,
      },
    };

    forwardToMain()(next)(action);

    expect(ipcRenderer.send.mock.calls.length).toBe(1);
    expect(ipcRenderer.send).toBeCalledWith('redux-action', action);
  });
});
