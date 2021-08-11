import { ipcMain } from 'electron';
import replayActionMain from '../replayActionMain';

jest.unmock('../replayActionMain');

describe('replayActionMain', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should replay any actions received', () => {
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
    };
    const payload = 123;

    replayActionMain(store);

    expect(ipcMain.on).toHaveBeenCalledTimes(2);
    expect(ipcMain.on.mock.calls[1][0]).toBe('redux-action');
    expect(ipcMain.on.mock.calls[1][1]).toBeInstanceOf(Function);

    const cb = ipcMain.on.mock.calls[1][1];
    cb('someEvent', payload);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });

  it('should reply current state', () => {
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(),
      subscribe: jest.fn(),
    };

    const initialState = { initial: 'state' };
    const newState = { new: 'state' };

    replayActionMain(store);

    store.getState.mockReturnValueOnce(initialState);
    store.getState.mockReturnValueOnce(newState);

    expect(ipcMain.on).toHaveBeenCalledTimes(2);
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
