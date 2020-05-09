const { syncMain } = require("../..");
const redux = require("redux");

const { increment, reducer } = require("./common");

const store = redux.createStore(reducer, syncMain);

exports.increment = increment;
exports.store = store;
