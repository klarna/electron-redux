import { ipcRenderer } from 'electron';
import forwardToMain, { forwardToMainWithParams } from '../forwardToMain';
import validateAction from '../../helpers/validateAction';

jest.unmock('../forwardToMain');

describe('forwardToMain', () => {
  beforeEach(() => {
    validateAction.mockReturnValue(true);
  });

  it("should pass an action through if it doesn't pass validation (FSA)", () => {
    const next = jest.fn();
    // thunk action
    const action = () => {};
    validateAction.mockReturnValue(false);

    forwardToMain()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should pass an action through if it starts with @@', () => {
    const next = jest.fn();
    const action = { type: '@@SOMETHING' };

    forwardToMain()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should pass an action through if it starts with redux-form', () => {
    const next = jest.fn();
    const action = { type: 'redux-form' };

    forwardToMain()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
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

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should forward any actions to the main process', () => {
    const next = jest.fn();
    const action = {
      type: 'SOMETHING',
      meta: {
        some: 'meta',
      },
    };

    forwardToMain()(next)(action);

    expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(ipcRenderer.send).toHaveBeenCalledWith('redux-action', action);

    expect(next).toHaveBeenCalledTimes(0);
  });
});

describe('forwardToMainWithParams', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validateAction.mockReturnValue(true);
  });

  it('should forward an action through if it starts with @@', () => {
    const next = jest.fn();
    const action = { type: '@@SOMETHING' };

    forwardToMainWithParams()()(next)(action);

    expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(ipcRenderer.send).toHaveBeenCalledWith('redux-action', action);

    expect(next).toHaveBeenCalledTimes(0);
  });

  it('should forward an action through if it starts with redux-form', () => {
    const next = jest.fn();
    const action = { type: 'redux-form' };

    forwardToMainWithParams()()(next)(action);

    expect(ipcRenderer.send).toHaveBeenCalledTimes(1);
    expect(ipcRenderer.send).toHaveBeenCalledWith('redux-action', action);

    expect(next).toHaveBeenCalledTimes(0);
  });

  it('should pass an action through if it is blacklisted', () => {
    const next = jest.fn();
    const action = { type: '@@SOMETHING' };

    forwardToMainWithParams({ blacklist: [/^@@/] })()(next)(action);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(action);
  });
});
