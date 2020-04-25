import { ipcMain } from 'electron';

const freezeDry = (key, value) => {
  if (value instanceof Map) {
    const obj = Object.fromEntries(value);
    obj.__hydrate_type = '__hydrate_map';
    return obj;
  } else if (value instanceof Set) {
    return {
      __hydrate_type: '__hydrate_set',
      items: Array.from(value),
    };
  }

  return value;
};

export default function replayActionMain(store) {
  /**
   * Give renderers a way to sync the current state of the store, but be sure
   * we don't expose any remote objects. In other words, we need our state to
   * be serializable.
   *
   * Refer to https://github.com/electron/electron/blob/master/docs/api/remote.md#remote-objects
   */
  global.getReduxState = () => JSON.stringify(store.getState(), freezeDry);

  ipcMain.on('redux-action', (event, payload) => {
    store.dispatch(payload);
  });
}
