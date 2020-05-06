const { syncRenderer } = require("@mckayla/electron-redux");
const { createStore, applyMiddleware } = require("redux");

const reducer = require("./reducers");

const store = createStore(reducer, syncRenderer);

const valueEl = document.getElementById("value");

const render = () => {
	valueEl.innerHTML = store.getState().count.toString();
};

render();
store.subscribe(render);

document.getElementById("increment").addEventListener("click", () => {
	store.dispatch({ type: "INCREMENT" });
});

document.getElementById("decrement").addEventListener("click", () => {
	store.dispatch({ type: "DECREMENT" });
});
