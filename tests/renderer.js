const { addItem, decrement, increment, store } = require("./store/renderer");

store.subscribe(() => {
	const state = store.getState();
	console.log("state", state);
	h.innerHTML = state.count;

	const q = store.getState().testSet;
	s.innerHTML = "";
	for (const p of q) {
		s.innerHTML += `${p} `;
	}
});

const h = document.createElement("h2");
h.innerHTML = store.getState().count;
document.body.appendChild(h);

const s = document.createElement("p");
const q = store.getState().testSet;
for (const p of q) {
	s.innerHTML += `${p} `;
}
document.body.appendChild(s);

const d = document.createElement("button");
d.innerHTML = "-";
d.addEventListener("click", () => store.dispatch(decrement()));
document.body.appendChild(d);

const i = document.createElement("button");
i.innerHTML = "+";
i.addEventListener("click", () => store.dispatch(increment()));
document.body.appendChild(i);

const x = document.createElement("input");
x.type = "text";
document.body.appendChild(x);

const a = document.createElement("button");
a.innerHTML = "+";
a.addEventListener("click", () => {
	store.dispatch(addItem(x.value));
	x.value = "";
});
document.body.appendChild(a);
