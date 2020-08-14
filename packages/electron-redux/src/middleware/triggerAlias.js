/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import assert from 'assert';
import { ALIASED } from '../actions/alias';
import aliasRegistry from '../registry/alias';
import expandAliasedAction from '../helpers/expandAliasedAction';

const triggerAlias = store => next => action => {
  // TODO: store.dispatch() instead to not skip any middleware
  if (action.type === ALIASED) {
    action = expandAliasedAction(action);
  }

  return next(action);
};

export default triggerAlias;
