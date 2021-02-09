/* eslint-disable @typescript-eslint/ban-types */

import { StoreEnhancer, StoreEnhancerStoreCreator } from 'redux'
import { forwardAction } from './forwardAction'
import { MainStateSyncEnhancerOptions } from './options/MainStateSyncEnhancerOptions'
import { RendererStateSyncEnhancerOptions } from './options/RendererStateSyncEnhancerOptions'
import { stateSyncEnhancer } from './stateSyncEnhancer'

export type StateSyncOptions = MainStateSyncEnhancerOptions | RendererStateSyncEnhancerOptions

const forwardActionEnhancer = (options?: StateSyncOptions): StoreEnhancer => (createStore) => (
    reducer,
    preloadedState
) => {
    const store = createStore(reducer, preloadedState)

    return forwardAction(store, options)
}

const extensionCompose = (options: StateSyncOptions) => <D extends StoreEnhancerStoreCreator>(
    ...funcs: Function[]
) => {
    return (createStore: D) => {
        return [
            stateSyncEnhancer({ ...options, preventActionReplay: true }),
            ...funcs,
            forwardActionEnhancer(options),
        ].reduceRight((composed, f) => f(composed), createStore)
    }
}

export function composeWithStateSync<R>(
    options: StateSyncOptions
): (...funcs: Function[]) => (...args: any[]) => R
export function composeWithStateSync<R>(...funcs: Function[]): (...args: any[]) => R
export function composeWithStateSync(
    firstFuncOrOpts: Function | StateSyncOptions,
    ...funcs: Function[]
) {
    if (arguments.length === 0) {
        return stateSyncEnhancer()
    }
    if (arguments.length === 1 && typeof firstFuncOrOpts === 'object') {
        return extensionCompose(firstFuncOrOpts)
    }
    return extensionCompose({})(firstFuncOrOpts as Function, ...funcs)
}
