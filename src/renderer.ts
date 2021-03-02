import { Action, StoreEnhancer } from 'redux'
import { forwardAction } from './utils/forwardAction'
import { replaceState, withStoreReplacer } from './utils/replaceState'
import { RendererStateSyncEnhancerOptions } from './options/RendererStateSyncEnhancerOptions'
import { preventDoubleInitialization, stopForwarding } from './utils'
import { StateSyncOptions } from './options/StateSyncOptions'
import { createComposer } from './composeWithStateSync'

/**
 * Creates new instance of renderer process redux enhancer.
 * Upon initialization, it will fetch the state from the main process & subscribe for event
 *  communication required to keep the actions in sync.
 * @param {RendererStateSyncEnhancerOptions} options Additional settings for enhancer
 * @returns StoreEnhancer
 */
export const stateSyncEnhancer = (
    options: RendererStateSyncEnhancerOptions = {}
): StoreEnhancer => (createStore) => {
    preventDoubleInitialization()

    return (reducer, state) => {
        if (typeof __ElectronReduxBridge === undefined) {
            throw new Error(
                'Looks like this renderer process has not been configured properly. Did you forgot to include preload script?'
            )
        }

        const initialState = options.lazyInit
            ? state
            : __ElectronReduxBridge.fetchInitialState<typeof state>(options)

        const store = createStore(
            options.lazyInit ? withStoreReplacer(reducer) : reducer,
            initialState
        )

        if (options.lazyInit) {
            __ElectronReduxBridge.fetchInitialStateAsync(options, (asyncState) => {
                store.dispatch(replaceState(asyncState) as never)
            })
        }

        // When receiving an action from main
        __ElectronReduxBridge.subscribeToIPCAction((action: Action) =>
            store.dispatch(stopForwarding(action))
        )

        return forwardAction(store, __ElectronReduxBridge.forwardActionToMain, options)
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const composeWithStateSync = (
    firstFuncOrOpts: StoreEnhancer | StateSyncOptions,
    ...funcs: StoreEnhancer[]
) =>
    createComposer(stateSyncEnhancer, __ElectronReduxBridge.forwardActionToMain)(
        firstFuncOrOpts,
        ...funcs
    )
