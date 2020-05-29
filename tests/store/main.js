const { syncMain } = require("../..");
const redux = require("redux");

const { reducer, ...actions } = require("./common");

const store = redux.createStore(reducer, syncMain);

module.exports = {
	store,
	...actions,
};
