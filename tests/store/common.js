const init = () => ({
	count: 0,
});

// type Action =
// 	| ReturnType<typeof increment>
// 	| ReturnType<typeof decrement>
// 	| ReturnType<typeof adjustBy>;

exports.increment = () => ({
	type: "mckayla.electron-redux.INCREMENT",
});

exports.decrement = () => ({
	type: "mckayla.electron-redux.DECREMENT",
});

exports.adjustBy = (amount) => ({
	type: "mckayla.electron-redux.ADJUST_BY",
	payload: { amount },
});

exports.reducer = (state = init(), action) => {
	switch (action.type) {
		case "mckayla.electron-redux.INCREMENT":
			return { count: state.count + 1 };
		case "mckayla.electron-redux.DECREMENT":
			return { count: state.count - 1 };
		case "mckayla.electron-redux.ADJUST_BY":
			return { count: state.count + action.payload.amount };
		default:
			return state;
	}
};
