/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import assert from 'assert';
import { ALIASED } from '../actions/alias';
import aliasRegistry from '../registry/alias';

const triggerAlias = store => next => (action) => {
  // TODO: store.dispatch() instead to not skip any middleware
  if (action.type === ALIASED) {
    assert(action.meta && action.meta.trigger, 'No trigger defined');
    const alias = aliasRegistry.get(action.meta.trigger);
    assert(alias, `Trigger alias ${action.meta.trigger} not found`);
    const args = action.payload || [];

    // trigger alias
    action = alias(...args);
  }

  return next(action);
};

export default triggerAlias;
