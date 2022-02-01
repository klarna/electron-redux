import { applyMiddleware, createStore } from 'redux'
import { reducer } from '../counter'
import { countMiddleware } from '../middleware'
import { composeWithStateSync } from '../../main'

const middleware = [countMiddleware]

const _store1 = createStore(reducer, composeWithStateSync(applyMiddleware(...middleware)))

const _store2 = createStore(reducer, composeWithStateSync({}, applyMiddleware(...middleware)))

const _store3 = createStore(
    reducer,
    composeWithStateSync({ denyList: [] }, applyMiddleware(...middleware))
)
