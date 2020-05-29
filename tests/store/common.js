const init = () => ({
	count: 0,
	testSet: new Set(["a", "b", "c"]),
});

// type Action =
// 	| ReturnType<typeof increment>
// 	| ReturnType<typeof decrement>
// 	| ReturnType<typeof adjustBy>;
//  | ReturnType<typeof addItem>;

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

exports.addItem = (item) => ({
	type: "mckayla.electron-redux.ADD_ITEM",
	payload: { item },
});

exports.reducer = (state = init(), action) => {
	switch (action.type) {
		case "mckayla.electron-redux.INCREMENT":
			return { ...state, count: state.count + 1 };
		case "mckayla.electron-redux.DECREMENT":
			return { ...state, count: state.count - 1 };
		case "mckayla.electron-redux.ADJUST_BY":
			return { ...state, count: state.count + action.payload.amount };
		case "mckayla.electron-redux.ADD_ITEM": {
			const copy = new Set(state.testSet);
			copy.add(action.payload.item);
			return { ...state, testSet: copy };
		}
		default:
			return state;
	}
};
