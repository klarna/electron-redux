const init = () => ({
	count: 0,
	testMap: new Map([
		["hello", "friend"],
		["name", "mckayla"],
	]),
	testSet: new Set([1, 2, 3, 4, 5]),
});

function counter(state = init(), action) {
	switch (action.type) {
		case "INCREMENT":
			return { ...state, count: state.count + 1 };
		case "DECREMENT":
			return { ...state, count: state.count - 1 };
		default:
			return state;
	}
}

module.exports = counter;
