// in the renderer store
import { ipcRenderer } from 'electron';
import { applyMiddleware, createStore } from 'redux';
import getInitialStateClient from '../src/helpers/getInitialStateClient';
import replayActionClient from '../src/helpers/replayActionClient';
import forwardToServer from '../src/middleware/forwardToServer';
import reducer from './reducers';

const namespace = 'getstation-electron-redux-test';

describe('forwards actions to and from renderer', () => {
  let store;
  before(() => {
    const initialState = getInitialStateClient(namespace);

    store = createStore(
      reducer,
      initialState,
      applyMiddleware(
        forwardToServer(namespace),
      ),
    );

    replayActionClient(namespace)(store);
  });

  it('should forward action from renderer to main', (done) => {
    ipcRenderer.once('test:reply-from-main', (_, newMainState) => {
      if (newMainState.test === 1) return done();
      return done(new Error(`Invalid main state ${JSON.stringify(newMainState)}`));
    });
    store.dispatch({
      type: 'test1',
    });
  });

  it('should forward action from main to renderer', (done) => {
    ipcRenderer.once('test:reply-from-main', (_, newMainState) => {
      if (newMainState.test === 2) {
        const localState = store.getState();
        if (localState.test === 2) return done();
      }
      return done(new Error(`Invalid main state ${JSON.stringify(newMainState)}`));
    });
    ipcRenderer.send('test:dispatch-from-main');
  });
});
