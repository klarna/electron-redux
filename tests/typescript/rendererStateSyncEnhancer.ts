import { stateSyncEnhancer } from '../../renderer'
import { createStore, Store } from 'redux'
import { reducer, CounterState, Actions } from '../counter'

const store: Store<CounterState, Actions> = createStore(reducer, stateSyncEnhancer())
const store2: Store<CounterState, Actions> = createStore(
    reducer,
    stateSyncEnhancer({ denyList: [] })
)
