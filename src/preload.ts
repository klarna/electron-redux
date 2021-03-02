import { contextBridge } from 'electron'
import { fetchInitialState } from './renderer/fetchInitialState'
import { fetchInitialStateAsync } from './renderer/fetchInitialStateAsync'
import { forwardActionToMain } from './renderer/forwardActionToMain'
import { subscribeToIPCAction } from './renderer/subscribeToIPCAction'

declare global {
    interface Bridge {
        fetchInitialState: typeof fetchInitialState
        fetchInitialStateAsync: typeof fetchInitialStateAsync
        forwardActionToMain: typeof forwardActionToMain
        subscribeToIPCAction: typeof subscribeToIPCAction
    }
    interface Window {
        __ElectronReduxBridge: Bridge
    }

    const __ElectronReduxBridge: Bridge
}

export const preload = (): void => {
    console.log('preloading...')
    const bridge = {
        fetchInitialState,
        fetchInitialStateAsync,
        forwardActionToMain,
        subscribeToIPCAction,
    }

    try {
        contextBridge.exposeInMainWorld('__ElectronReduxBridge', bridge)
    } catch {
        console.log('exposeInMainWorld not avaiable')
        window.__ElectronReduxBridge = bridge
    }
}

// run it!
preload()
