import { ipcMain } from 'electron';
import replayActionMain from '../replayActionMain';

jest.unmock('../replayActionMain');

describe('replayActionMain', () => {
  it('should replay any actions received', () => {
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
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

  it('should return the current state from the global', () => {
    const initialState = { initial: 'state' };
    const newState = { new: 'state' };
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
    };

    store.getState.mockReturnValueOnce(initialState);
    store.getState.mockReturnValueOnce(newState);

    replayActionMain(store);

    expect(global.getReduxState()).toEqual(JSON.stringify(initialState));
    expect(store.getState).toHaveBeenCalledTimes(1);

    expect(global.getReduxState()).toEqual(JSON.stringify(newState));
    expect(store.getState).toHaveBeenCalledTimes(2);
  });
});
