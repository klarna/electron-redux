const { createStore, applyMiddleware } = require('redux');
const {
  forwardToMain,
  replayActionRenderer,
  getInitialStateRenderer,
  createAliasedAction,
} = require('electron-redux');
const reducers = require('./reducers');

const initialState = getInitialStateRenderer();
const store = createStore(reducers, initialState, applyMiddleware(forwardToMain));

replayActionRenderer(store);

const valueEl = document.getElementById('value');

function render() {
  valueEl.innerHTML = store.getState().toString();
}

render();

store.subscribe(render);

document.getElementById('increment').addEventListener('click', () => {
  store.dispatch({ type: 'INCREMENT' });
});

document.getElementById('decrement').addEventListener('click', () => {
  store.dispatch({ type: 'DECREMENT' });
});

document.getElementById('incrementAliased').addEventListener('click', () => {
  store.dispatch(createAliasedAction('INCREMENT_ALIASED', () => ({ type: 'INCREMENT' }))());
});
