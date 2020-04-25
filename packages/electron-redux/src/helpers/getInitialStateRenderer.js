import { remote } from 'electron';

const hydrate = (key, value) => {
  if (value?.__hydrate_type === '__hydrate_map') {
    return new Map(Object.entries(value).filter(([key]) => key !== '__hydrate_type'));
  } else if (value?.__hydrate_type === '__hydrate_set') {
    return new Set(value.items);
  }

  return value;
};

export default function getInitialStateRenderer() {
  const getReduxState = remote.getGlobal('getReduxState');
  if (!getReduxState) {
    throw new Error(
      'Could not find reduxState global in main process, did you forget to call replayActionMain?',
    );
  }
  return JSON.parse(getReduxState(), hydrate);
}
