import { ipcMain } from 'electron';
import replayActionServer from '../replayActionServer';

const namespace = 'getstation-electron-redux-test';

describe('replayActionServer', () => {
  it('should replay any actions received', () => {
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
    };
    const payload = 123;

    replayActionServer(namespace)(store);

    expect(ipcMain.on).toHaveBeenCalledTimes(1);
    expect(ipcMain.on.mock.calls[0][0]).toBe('redux-action');
    expect(ipcMain.on.mock.calls[0][1]).toBeInstanceOf(Function);

    const cb = ipcMain.on.mock.calls[0][1];
    cb('someEvent', payload);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });
});
