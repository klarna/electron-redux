import { composeWithStateSync } from '../../types'
import { applyMiddleware, createStore, Store, StoreEnhancer } from 'redux'
import { reducer, CounterState, Actions } from '../counter'
import { countMiddleware } from '../middleware'

// This is just a dummy enhancer, this does nothing
const someOtherEnhancer: StoreEnhancer = (next) => {
    return (reducer, state) => {
        return next(reducer, state)
    }
}

const middleware = applyMiddleware(countMiddleware)

const enhancerWithoutOptions: StoreEnhancer = composeWithStateSync(middleware, someOtherEnhancer)

const store: Store<CounterState, Actions> = createStore(reducer, enhancerWithoutOptions)

const enhancerWithOptions: StoreEnhancer = composeWithStateSync({ denyList: [] })(
    middleware,
    someOtherEnhancer
)

const store2: Store<CounterState, Actions> = createStore(reducer, enhancerWithOptions)
