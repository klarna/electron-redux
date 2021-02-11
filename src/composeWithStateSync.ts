/* eslint-disable @typescript-eslint/ban-types */

import { StoreEnhancer } from 'redux'
import { forwardAction } from './forwardAction'
import { StateSyncOptions } from './options/StateSyncOptions'
import { stateSyncEnhancer } from './stateSyncEnhancer'

const forwardActionEnhancer = (options?: StateSyncOptions): StoreEnhancer => (createStore) => (
    reducer,
    preloadedState
) => {
    const store = createStore(reducer, preloadedState)

    return forwardAction(store, options)
}

const extensionCompose = (options: StateSyncOptions) => (
    ...funcs: StoreEnhancer[]
): StoreEnhancer => {
    return (createStore) => {
        return [
            stateSyncEnhancer({ ...options, preventActionReplay: true }),
            ...funcs,
            forwardActionEnhancer(options),
        ].reduceRight((composed, f) => f(composed), createStore)
    }
}

export function composeWithStateSync(
    options: StateSyncOptions
): (...funcs: Function[]) => StoreEnhancer
export function composeWithStateSync(...funcs: StoreEnhancer[]): StoreEnhancer
export function composeWithStateSync(
    firstFuncOrOpts: StoreEnhancer | StateSyncOptions,
    ...funcs: StoreEnhancer[]
): StoreEnhancer | ((...funcs: StoreEnhancer[]) => StoreEnhancer) {
    if (arguments.length === 0) {
        return stateSyncEnhancer()
    }
    if (arguments.length === 1 && typeof firstFuncOrOpts === 'object') {
        return extensionCompose(firstFuncOrOpts)
    }
    return extensionCompose({})(firstFuncOrOpts as StoreEnhancer, ...funcs)
}
