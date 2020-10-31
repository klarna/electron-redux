import { ipcMain, webContents } from 'electron'
import { Action, applyMiddleware, Middleware, StoreCreator, StoreEnhancer } from 'redux'
import { ACTION, INIT_STATE, INIT_STATE_ASYNC } from './constants'
import {
    defaultMainOptions,
    MainStateSyncEnhancerOptions,
} from './options/MainStateSyncEnhancerOptions'

import { preventDoubleInitialization, stopForwarding, validateAction } from './utils'

function createMiddleware(options: MainStateSyncEnhancerOptions) {
    const middleware: Middleware = (store) => {
        ipcMain.handle(INIT_STATE_ASYNC, async () => {
            return JSON.stringify(store.getState(), options.replacer)
        })

        ipcMain.on(INIT_STATE, (event) => {
            event.returnValue = JSON.stringify(store.getState(), options.replacer)
        })

        // When receiving an action from a renderer
        ipcMain.on(ACTION, (event, action: Action) => {
            const localAction = stopForwarding(action)
            store.dispatch(localAction)

            // Forward it to all of the other renderers
            webContents.getAllWebContents().forEach((contents) => {
                // Ignore the renderer that sent the action and chromium devtools
                if (
                    contents.id !== event.sender.id &&
                    !contents.getURL().startsWith('devtools://')
                ) {
                    contents.send(ACTION, localAction)
                }
            })
        })

        return (next) => (action) => {
            if (validateAction(action)) {
                webContents.getAllWebContents().forEach((contents) => {
                    // Ignore chromium devtools
                    if (contents.getURL().startsWith('devtools://')) return
                    contents.send(ACTION, action)
                })
            }

            return next(action)
        }
    }
    return middleware
}

/**
 * Creates new instance of main process redux enhancer.
 * @param {MainStateSyncEnhancerOptions} options Additional enhancer options
 * @returns StoreEnhancer
 */
export const mainStateSyncEnhancer = (options = defaultMainOptions): StoreEnhancer => (
    createStore: StoreCreator
) => {
    preventDoubleInitialization()
    const middleware = createMiddleware(options)
    return (reducer, state) => {
        return createStore(reducer, state, applyMiddleware(middleware))
    }
}
