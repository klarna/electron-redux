import { ALIASED } from '../actions/alias';
import aliasRegistry from '../registry/alias';

export default function createAliasedAction(name, actionCreator) {
  // register
  aliasRegistry.set(name, actionCreator);

  // factory
  return (...args) => ({
    type: ALIASED,
    payload: args,
    meta: {
      trigger: name,
    },
  });
}
