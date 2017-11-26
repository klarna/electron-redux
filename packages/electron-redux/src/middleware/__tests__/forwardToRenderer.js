import { webContents } from 'electron';
import forwardToRenderer from '../forwardToRenderer';

jest.unmock('../forwardToRenderer');

describe('forwardToRenderer', () => {
  it('should pass an action through to the main store', () => {
    const next = jest.fn();
    const action = { type: 'SOMETHING' };

    forwardToRenderer()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should forward any actions to the renderer', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
      },
    };
    const send = jest.fn();
    webContents.getAllWebContents.mockImplementation(() => [{ send }]);

    forwardToRenderer()(next)(action);

    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith('redux-action', {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
        scope: 'local',
      },
    });
  });

  it('should ignore local actions', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        scope: 'local',
      },
    };
    const send = jest.fn();
    webContents.getAllWebContents.mockImplementation(() => [{ send }]);

    forwardToRenderer()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
    expect(send).toHaveBeenCalledTimes(0);
  });
});
