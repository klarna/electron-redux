import { syncRenderer } from '../..';
import { createStore, Store } from 'redux'
import { reducer, CounterState, Actions } from './store';

const store: Store<CounterState, Actions> = createStore(reducer, syncRenderer);
