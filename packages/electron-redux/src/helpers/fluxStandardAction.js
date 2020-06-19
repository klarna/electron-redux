function isValidKey(key) {
  return ['type', 'payload', 'error', 'meta'].indexOf(key) > -1;
}

export function isFSA(action) {
  return (
    typeof action === 'object'
    && !Array.isArray(action)
    && typeof action.type === 'string'
    && Object.keys(action).every(isValidKey)
  );
}

export function isError(action) {
  return isFSA(action) && action.error === true;
}
