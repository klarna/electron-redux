const log = require("debug")("mckayla.electron-redux.test");
const { decrement, increment, store } = require("./store/renderer");

store.subscribe(() => {
	const state = store.getState();
	log(state);
	d.innerHTML = state.count;
});

const d = document.createElement("h2");
d.innerHTML = store.getState().count;
document.body.appendChild(d);

const b = document.createElement("button");
b.innerHTML = "-";
b.addEventListener("click", () => store.dispatch(decrement()));
document.body.appendChild(b);

const i = document.createElement("button");
i.innerHTML = "+";
i.addEventListener("click", () => store.dispatch(increment()));
document.body.appendChild(i);
