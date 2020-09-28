import { syncRenderer } from '../..';
import { createStore, Store } from 'redux'
import { reducer, CounterState, Actions } from '../counter';

const store: Store<CounterState, Actions> = createStore(reducer, syncRenderer);
