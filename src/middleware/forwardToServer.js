const forwardToServer = peer => store => next => (action) => { // eslint-disable-line no-unused-vars
  if (typeof action === 'function') return next(action);
  if (
    (action.type.substr(0, 2) !== '@@' || action.type.substr(0, 10) === '@@redux-ui')
    && action.type.substr(0, 10) !== 'redux-form'
    && (
      !action.meta
      || !action.meta.scope
      || action.meta.scope !== 'local'
    )
  ) {
    const newAction = {
      ...action,
      meta: {
        ...action.meta,
        sender: peer.id,
      },
    };
    peer.notify('redux-action', newAction);

    return next(newAction);
  }

  return next(action);
};

export default forwardToServer;
