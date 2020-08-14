import assert from 'assert';
import aliasRegistry from '../registry/alias';

export default function expandAliasedAction(action) {
  assert(action.meta && action.meta.trigger, 'No trigger defined');
  const alias = aliasRegistry.get(action.meta.trigger);
  assert(alias, `Trigger alias ${action.meta.trigger} not found`);
  return alias(...(action.payload || []));
}
