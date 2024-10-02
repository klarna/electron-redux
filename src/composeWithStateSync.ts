/* eslint-disable @typescript-eslint/ban-types */

import { StoreEnhancer } from 'redux'
import { forwardAction, ProcessForwarder } from './utils/forwardAction'
import { StateSyncOptions } from './options/StateSyncOptions'
import { StateSyncEnhancer } from './utils/types'

const forwardActionEnhancer = (
    processForwarder: ProcessForwarder,
    options?: StateSyncOptions
): StoreEnhancer => (createStore) => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState)

    return forwardAction(store, processForwarder, options)
}

const extensionCompose = (
    stateSyncEnhancer: StateSyncEnhancer,
    processForwarder: ProcessForwarder,
    options: StateSyncOptions
) => (...funcs: StoreEnhancer[]): StoreEnhancer => {
    return (createStore) => {
        return [
            stateSyncEnhancer({ ...options, preventActionReplay: true }),
            ...funcs,
            forwardActionEnhancer(processForwarder, options),
        ].reduceRight((composed, f) => f(composed), createStore)
    }
}

export function createComposer(
    stateSyncEnhancer: StateSyncEnhancer,
    processForwarder: ProcessForwarder
) {
    return function composeWithStateSync(
        firstFuncOrOpts: StoreEnhancer | StateSyncOptions,
        ...funcs: Array<StoreEnhancer>
    ): StoreEnhancer {
        if (arguments.length === 0) {
            return stateSyncEnhancer({})
        }
        if (arguments.length === 1 && typeof firstFuncOrOpts === 'object') {
            return extensionCompose(stateSyncEnhancer, processForwarder, firstFuncOrOpts)()
        }
        return extensionCompose(
            stateSyncEnhancer,
            processForwarder,
            {}
        )(firstFuncOrOpts as StoreEnhancer, ...funcs)
    }
}
