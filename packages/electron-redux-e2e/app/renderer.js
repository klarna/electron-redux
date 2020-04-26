require('source-map-support/register');
const { createStore, applyMiddleware } = require("redux");
const {
	getRendererState,
	useRenderer,
} = require("@mckayla/electron-redux");

const reducers = require("./reducers");

console.log(useRenderer);

getRendererState().then(state => {
	const store = createStore(
		reducers,
		state,
		applyMiddleware(useRenderer),
	);

	const valueEl = document.getElementById("value");

	const render = () => {
		console.log(store.getState());
		valueEl.innerHTML = store.getState().count.toString();
	}

	render();
	store.subscribe(render);
	

	
	
	document.getElementById("increment").addEventListener("click", () => {
		store.dispatch({ type: "INCREMENT" });
	});
	
	document.getElementById("decrement").addEventListener("click", () => {
		store.dispatch({ type: "DECREMENT" });
	});
});





