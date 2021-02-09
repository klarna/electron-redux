import { StoreEnhancer } from 'redux'
import { StateSyncOptions } from './composeWithStateSync'
import { mainStateSyncEnhancer } from './mainStateSyncEnhancer'
import { rendererStateSyncEnhancer } from './rendererStateSyncEnhancer'
import { isMain, isRenderer, preventDoubleInitialization } from './utils'

export const stateSyncEnhancer = (config: StateSyncOptions = {}): StoreEnhancer => {
    preventDoubleInitialization()

    if (isRenderer) {
        return rendererStateSyncEnhancer(config)
    } else if (isMain) {
        return mainStateSyncEnhancer(config)
    }

    throw new Error(`Unsupported process: ${process?.type}`)
}
