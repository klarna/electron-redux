const redux = require('redux');
const reducers = require('./reducers');

const store = redux.createStore(reducers);
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
document.getElementById('incrementIfOdd').addEventListener('click', () => {
  if (store.getState() % 2 !== 0) {
    store.dispatch({ type: 'INCREMENT' });
  }
});
document.getElementById('incrementAsync').addEventListener('click', () => {
  setTimeout(() => {
    store.dispatch({ type: 'INCREMENT' });
  }, 1000);
});
