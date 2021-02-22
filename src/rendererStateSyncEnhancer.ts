import { ipcRenderer } from 'electron'
import { Action, StoreEnhancer } from 'redux'
import { IPCEvents } from './constants'
import { forwardAction } from './forwardAction'
import { fetchInitialState, fetchInitialStateAsync } from './fetchState'
import { replaceState, withStoreReplacer } from './fetchState/replaceState'
import { RendererStateSyncEnhancerOptions } from './options/RendererStateSyncEnhancerOptions'
import { stopForwarding } from './utils'

/**
 * Creates new instance of renderer process redux enhancer.
 * Upon initialization, it will fetch the state from the main process & subscribe for event
 *  communication required to keep the actions in sync.
 * @param {RendererStateSyncEnhancerOptions} options Additional settings for enhancer
 * @returns StoreEnhancer
 */
export const rendererStateSyncEnhancer = (
    options: RendererStateSyncEnhancerOptions = {}
): StoreEnhancer<any> => (createStore) => {
    return (reducer, state) => {
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

        // When receiving an action from main
        ipcRenderer.on(IPCEvents.ACTION, (_, action: Action) => {
            store.dispatch(stopForwarding(action))
        })

        return forwardAction(store, options)
    }
}
