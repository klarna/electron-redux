import { StoreEnhancer } from 'redux'
import { RendererStateSyncEnhancerOptions } from './options/RendererStateSyncEnhancerOptions'
import { preventDoubleInitialization } from './utils'
import { StateSyncOptions } from './options/StateSyncOptions'

/**
 * Creates new instance of renderer process redux enhancer.
 * Upon initialization, it will fetch the state from the main process & subscribe for event
 *  communication required to keep the actions in sync.
 * @param {RendererStateSyncEnhancerOptions} options Additional settings for enhancer
 * @returns StoreEnhancer
 */
export const stateSyncEnhancer = (
    options: RendererStateSyncEnhancerOptions = {}
): StoreEnhancer => {
    preventDoubleInitialization()
    assertElectronReduxBridgeAvailability()
    return __ElectronReduxBridge.stateSyncEnhancer(options)
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const composeWithStateSync = (
    firstFuncOrOpts: StoreEnhancer | StateSyncOptions,
    ...funcs: StoreEnhancer[]
) => {
    assertElectronReduxBridgeAvailability()
    return __ElectronReduxBridge.composeWithStateSync(firstFuncOrOpts, ...funcs)
}

const assertElectronReduxBridgeAvailability = () => {
    if (typeof __ElectronReduxBridge === undefined) {
        throw new Error(
            'Looks like this renderer process has not been configured properly. Did you forgot to include preload script?'
        )
    }
}
