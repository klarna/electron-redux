import { ipcMain } from 'electron';
import replayActionMain from '../replayActionMain';

jest.unmock('../replayActionMain');

describe('replayActionMain', () => {
  const store = {
    dispatch: jest.fn(),
    getState: jest.fn(),
    subscribe: jest.fn(),
  };

  replayActionMain(store);

  it('should replay any actions received', () => {
    const payload = 123;

    expect(ipcMain.on).toHaveBeenCalledTimes(2);
    expect(ipcMain.on.mock.calls[1][0]).toBe('redux-action');
    expect(ipcMain.on.mock.calls[1][1]).toBeInstanceOf(Function);

    const cb = ipcMain.on.mock.calls[1][1];
    cb('someEvent', payload);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });

  it('should reply current state', () => {
    const initialState = { initial: 'state' };
    const newState = { new: 'state' };

    store.getState.mockReturnValueOnce(initialState);
    store.getState.mockReturnValueOnce(newState);

    expect(ipcMain.on.mock.calls[0][0]).toBe('get-redux-state');
    expect(ipcMain.on.mock.calls[0][1]).toBeInstanceOf(Function);

    const cb = ipcMain.on.mock.calls[0][1];
    const event = { returnValue: '' };
    cb(event);

    expect(event.returnValue).toEqual(JSON.stringify(initialState));
    expect(store.getState).toHaveBeenCalledTimes(1);

    cb(event);
    expect(event.returnValue).toEqual(JSON.stringify(newState));
    expect(store.getState).toHaveBeenCalledTimes(2);
  });
});
