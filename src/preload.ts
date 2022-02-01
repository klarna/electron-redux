import { contextBridge } from 'electron'
import { StoreEnhancer, Action } from 'redux'
import { createComposer } from './composeWithStateSync'
import { RendererStateSyncEnhancerOptions } from './options/RendererStateSyncEnhancerOptions'
import { StateSyncOptions } from './options/StateSyncOptions'
import { fetchInitialState } from './renderer/fetchInitialState'
import { fetchInitialStateAsync } from './renderer/fetchInitialStateAsync'
import { forwardActionToMain } from './renderer/forwardActionToMain'
import { subscribeToIPCAction } from './renderer/subscribeToIPCAction'
import { preventDoubleInitialization, stopForwarding } from './utils'
import { forwardAction } from './utils/forwardAction'
import { withStoreReplacer, replaceState } from './utils/replaceState'

declare global {
    interface Bridge {
        stateSyncEnhancer: typeof stateSyncEnhancer
        composeWithStateSync: typeof composeWithStateSync
    }
    interface Window {
        __ElectronReduxBridge: Bridge
    }

    const __ElectronReduxBridge: Bridge
}

const stateSyncEnhancer = (options: RendererStateSyncEnhancerOptions = {}): StoreEnhancer => (
    createStore
) => {
    preventDoubleInitialization()

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
        subscribeToIPCAction((action: Action) => store.dispatch(stopForwarding(action)))

        return forwardAction(store, forwardActionToMain, options)
    }
}

const composeWithStateSync = (
    firstFuncOrOpts: StoreEnhancer | StateSyncOptions,
    ...funcs: StoreEnhancer[]
) => createComposer(stateSyncEnhancer, forwardActionToMain)(firstFuncOrOpts, ...funcs)

export const preload = (): void => {
    const bridge = {
        stateSyncEnhancer,
        composeWithStateSync,
    }

    try {
        contextBridge.exposeInMainWorld('__ElectronReduxBridge', bridge)
    } catch {
        window.__ElectronReduxBridge = bridge
    }
}

// run it!
preload()
