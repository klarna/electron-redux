import { ipcRenderer } from 'electron';
import replayActionRenderer from '../replayActionRenderer';

jest.unmock('../replayActionRenderer');

describe('replayActionRenderer', () => {
  it('should replay any actions received', () => {
    const store = {
      dispatch: jest.fn(),
    };
    const payload = 123;

    replayActionRenderer(store);

    expect(ipcRenderer.on).toHaveBeenCalledTimes(1);
    expect(ipcRenderer.on.mock.calls[0][0]).toBe('redux-action');
    expect(ipcRenderer.on.mock.calls[0][1]).toBeInstanceOf(Function);

    const cb = ipcRenderer.on.mock.calls[0][1];
    cb('someEvent', payload);

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(payload);
  });
});
