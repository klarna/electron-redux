'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = replayActionMain;

var _electronSimpleIpc = require('electron-simple-ipc');

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var stringify = function stringify(object) {
  // Stringify without circular references
  // http://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
  var cache = [];
  return JSON.stringify(object, function (key, value) {
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
      if (cache.includes(value)) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
};

function replayActionMain(store) {
  // we have to do this to ease remote-loading of the initial state :(
  global.reduxState = store.getState();
  global.reduxStateStringified = stringify(store.getState());
  store.subscribe(function () {
    global.reduxState = store.getState();
    global.reduxStateStringified = stringify(store.getState());
  });

  (0, _electronSimpleIpc.ipcReceive)('redux-action', store.dispatch);
}