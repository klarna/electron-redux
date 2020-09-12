import { ipcRenderer } from 'electron';
import validateAction from '../helpers/validateAction';

// eslint-disable-next-line consistent-return, no-unused-vars
export const forwardToMainWithParams = (params = {}) => (store) => (next) => (action) => {
  const { blacklist = [], id } = params;
  if (!validateAction(action)) return next(action);
  if (action.meta && action.meta.scope === 'local') return next(action);

  if (blacklist.some((rule) => rule.test(action.type))) {
    return next(action);
  }

  let mainAction = action;

  if (id) {
    next(action);
    mainAction = {
      ...action,
      meta: {
        ...action.meta,
        id,
      },
    };
    window.electronReduxId = id;
  }

  // stop action in-flight
  ipcRenderer.send('redux-action', mainAction);
};

const forwardToMain = forwardToMainWithParams({
  blacklist: [/^@@/, /^redux-form/],
});

export default forwardToMain;
