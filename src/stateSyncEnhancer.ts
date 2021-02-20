import { StoreEnhancer } from 'redux'
import { mainStateSyncEnhancer } from './mainStateSyncEnhancer'
import { StateSyncOptions } from './options/StateSyncOptions'
import { rendererStateSyncEnhancer } from './rendererStateSyncEnhancer'
import { isMain, isRenderer, preventDoubleInitialization } from './utils'

export const stateSyncEnhancer = (config: StateSyncOptions = {}): StoreEnhancer<any> => {
    preventDoubleInitialization()

    if (isRenderer) {
        return rendererStateSyncEnhancer(config)
    } else if (isMain) {
        return mainStateSyncEnhancer(config)
    }

    throw new Error(`Unsupported process: process.type = ${process?.type}`)
}
