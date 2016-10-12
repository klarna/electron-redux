import { ipcMain } from 'electron';
import replayActionMain from '../replayActionMain';

jest.unmock('../replayActionMain');

describe('replayActionMain', () => {
  it('should replay any actions received', () => {
    const store = {
      dispatch: jest.fn(),
    };
    const payload = 123;

    replayActionMain(store);

    expect(ipcMain.on).toHaveBeenCalledTimes(1);
    expect(ipcMain.on.mock.calls[0][0]).toBe('redux-action');
    expect(ipcMain.on.mock.calls[0][1]).toBeInstanceOf(Function);

    const cb = ipcMain.on.mock.calls[0][1];
    cb('someEvent', payload);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });
});
