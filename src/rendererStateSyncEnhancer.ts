import { ipcRenderer } from 'electron'
import { Action, applyMiddleware, Middleware, StoreCreator, StoreEnhancer } from 'redux'
import { IPCEvents } from './constants'
import { fetchInitialState, fetchInitialStateAsync } from './fetchState'
import { replaceState, withStoreReplacer } from './fetchState/replaceState'
import { defaultRendererOptions, RendererStateSyncEnhancerOptions } from './options/RendererStateSyncEnhancerOptions'

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
        const initialState = options.lazyInit ? state : fetchInitialState<typeof state>(options)
        const store = createStore(
            options.lazyInit ? withStoreReplacer(reducer) : reducer,
            initialState,
            applyMiddleware(createMiddleware(options))
        )

        if (options.lazyInit) {
            fetchInitialStateAsync(options, (asyncState) => {
                store.dispatch(replaceState(asyncState) as never)
            })
        }

        // TODO: this needs some ❤️
        // XXX: TypeScript is dumb. If you return the call to createStore
        // immediately it's fine, but even assigning it to a constant and returning
        // will make it freak out. We fix this with the line below the return.
        return store

        // TODO: this needs some ❤️
        // XXX: Even though this is unreachable, it fixes the type signature????
        return (store as unknown) as any
    }
}
