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

  it('should subscribe to the store and update the global state', () => {
    const initialState = { initial: 'state' };
    const newState = { new: 'state' };
    const store = {
      dispatch: jest.fn(),
      getState: jest.fn(() => initialState),
      subscribe: jest.fn(),
    };

    replayActionMain(store);

    expect(global.reduxState).toEqual(initialState);
    expect(store.subscribe).toHaveBeenCalledTimes(1);
    expect(store.subscribe.mock.calls[0][0]).toBeInstanceOf((Function));

    const subscribeCb = store.subscribe.mock.calls[0][0];
    store.getState = jest.fn(() => newState);
    subscribeCb();

    expect(global.reduxState).toEqual(newState);
  });
});
