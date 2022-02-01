import { StoreEnhancer } from 'redux'
import { StateSyncOptions } from '../options/StateSyncOptions'

export type StateSyncEnhancer = (options: StateSyncOptions) => StoreEnhancer
