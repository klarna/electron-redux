// in the renderer store
import { ipcRenderer } from 'electron';
import { applyMiddleware, createStore } from 'redux';
import getInitialStateRenderer from '../src/helpers/getInitialStateRenderer';
import replayActionRenderer from '../src/helpers/replayActionRenderer';
import forwardToMain from '../src/middleware/forwardToMain';
import reducer from './reducers';

describe('forwards actions to and from renderer', () => {
  let store;
  before(() => {
    const initialState = getInitialStateRenderer();

    store = createStore(
      reducer,
      initialState,
      applyMiddleware(
        forwardToMain,
      ),
    );

    replayActionRenderer(store);
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
      if (newMainState.test === 2) return done();
      return done(new Error(`Invalid main state ${JSON.stringify(newMainState)}`));
    });
    ipcRenderer.send('test:dispatch-from-main');
  });
});
