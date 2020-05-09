const { syncRenderer } = require("../..");
const redux = require("redux");

const { decrement, increment, reducer } = require("./common");

const store = redux.createStore(reducer, syncRenderer);

exports.decrement = decrement;
exports.increment = increment;
exports.store = store;
