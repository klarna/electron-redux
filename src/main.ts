import { ipcMain, webContents } from 'electron'
import { Action, StoreEnhancer } from 'redux'
import { IPCEvents } from './constants'
import { forwardAction } from './utils/forwardAction'
import { forwardActionToRenderers } from './main/forwardActionToRenderers'
import { MainStateSyncEnhancerOptions } from './options/MainStateSyncEnhancerOptions'
import { preventDoubleInitialization, stopForwarding } from './utils'
import { StateSyncOptions } from './options/StateSyncOptions'
import { createComposer } from './composeWithStateSync'

/**
 * Creates new instance of main process redux enhancer.
 * @param {MainStateSyncEnhancerOptions} options Additional enhancer options
 * @returns StoreEnhancer
 */
export const stateSyncEnhancer = (options: MainStateSyncEnhancerOptions = {}): StoreEnhancer => (
    createStore
) => {
    preventDoubleInitialization()

    return (reducer, preloadedState) => {
        const store = createStore(reducer, preloadedState)

        ipcMain.handle(IPCEvents.INIT_STATE_ASYNC, async () => {
            return JSON.stringify(store.getState(), options.serializer)
        })

        ipcMain.on(IPCEvents.INIT_STATE, (event) => {
            event.returnValue = JSON.stringify(store.getState(), options.serializer)
        })

        // When receiving an action from a renderer
        ipcMain.on(IPCEvents.ACTION, (event, action: Action) => {
            const localAction = stopForwarding(action)

            store.dispatch(localAction)

            // Forward it to all of the other renderers
            webContents.getAllWebContents().forEach((contents) => {
                // Ignore the renderer that sent the action and chromium devtools
                if (
                    contents.id !== event.sender.id &&
                    !contents.getURL().startsWith('devtools://')
                ) {
                    contents.send(IPCEvents.ACTION, localAction)
                }
            })
        })

        return forwardAction(store, forwardActionToRenderers, options)
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const composeWithStateSync = (
    firstFuncOrOpts: StoreEnhancer | StateSyncOptions,
    ...funcs: StoreEnhancer[]
): StoreEnhancer =>
    createComposer(stateSyncEnhancer, forwardActionToRenderers)(firstFuncOrOpts, ...funcs)
