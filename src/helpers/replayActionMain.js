import { ipcReceive } from 'electron-simple-ipc';

const stringify = (object) => {
  // Stringify without circular references
  // http://stackoverflow.com/questions/11616630/json-stringify-avoid-typeerror-converting-circular-structure-to-json
  const cache = [];
  return JSON.stringify(object, function(key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    return value;
  });
}

export default function replayActionMain(store) {
  // we have to do this to ease remote-loading of the initial state :(
  global.reduxState = store.getState();
  global.reduxStateStringified = stringify(store.getState());
  store.subscribe(() => {
    global.reduxState = store.getState();
    global.reduxStateStringified = stringify(store.getState());
  });

  ipcReceive('redux-action', store.dispatch);
}
