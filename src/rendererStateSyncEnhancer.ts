import { ipcRenderer } from 'electron'
import {
    Action,
    compose,
    Dispatch,
    Middleware,
    MiddlewareAPI,
    StoreCreator,
    StoreEnhancer,
} from 'redux'
import { IPCEvents } from './constants'
import { fetchInitialState, fetchInitialStateAsync } from './fetchState'
import { replaceState, withStoreReplacer } from './fetchState/replaceState'
import {
    defaultRendererOptions,
    RendererStateSyncEnhancerOptions,
} from './options/RendererStateSyncEnhancerOptions'
import { preventDoubleInitialization, stopForwarding, validateAction } from './utils'

const createMiddleware = (options: RendererStateSyncEnhancerOptions): Middleware => (store) => {
    // When receiving an action from main
    ipcRenderer.on(IPCEvents.ACTION, (_, action: Action) => {
        store.dispatch(stopForwarding(action))
    })

    return (next) => (action) => {
        if (validateAction(action, options.denyList)) {
            ipcRenderer.send(IPCEvents.ACTION, action)
        }

        return next(action)
    }
}

/**
 * Creates new instance of renderer process redux enhancer.
 * Upon initialization, it will fetch the state from the main process & subscribe for event
 *  communication required to keep the actions in sync.
 * @param {RendererStateSyncEnhancerOptions} options Additional settings for enhancer
 * @returns StoreEnhancer
 */
export const rendererStateSyncEnhancer = (options = defaultRendererOptions): StoreEnhancer => (
    createStore: StoreCreator
) => {
    preventDoubleInitialization()

    return (reducer, state) => {
        const middleware = createMiddleware(options)

        const initialState = options.lazyInit ? state : fetchInitialState<typeof state>(options)
        const store = createStore(
            options.lazyInit ? withStoreReplacer(reducer) : reducer,
            initialState
        )

        if (options.lazyInit) {
            fetchInitialStateAsync(options, (asyncState) => {
                store.dispatch(replaceState(asyncState) as never)
            })
        }

        let dispatch = store.dispatch

        const middlewareAPI: MiddlewareAPI<Dispatch<any>> = {
            getState: store.getState,
            dispatch,
        }

        dispatch = compose<Dispatch>(middleware(middlewareAPI))(dispatch)

        return {
            ...store,
            dispatch,
        }
    }
}
