import { ipcMain, webContents } from 'electron'
import { Action, applyMiddleware, Middleware, StoreCreator, StoreEnhancer } from 'redux'

import { preventDoubleInitialization, stopForwarding, validateAction } from './utils'

function createMiddleware(options: MainStateSyncEnhancerOptions) {
    const middleware: Middleware = (store) => {
        ipcMain.handle('electron-redux.INIT_STATE', async () => {
            // Serialize the initial state using custom replacer
            return JSON.stringify(store.getState(), options.replacer)
        })

        // When receiving an action from a renderer
        ipcMain.on('electron-redux.ACTION', (event, action: Action) => {
            const localAction = stopForwarding(action)
            store.dispatch(localAction)

            // Forward it to all of the other renderers
            webContents.getAllWebContents().forEach((contents) => {
                // Ignore the renderer that sent the action
                if (contents.id !== event.sender.id) {
                    contents.send('electron-redux.ACTION', localAction)
                }
            })
        })

        return (next) => (action) => {
            if (validateAction(action)) {
                webContents.getAllWebContents().forEach((contents) => {
                    contents.send('electron-redux.ACTION', action)
                })
            }

            return next(action)
        }
    }
    return middleware
}

export type MainStateSyncEnhancerOptions = {
    /**
     * Custom store serializaton function. This function is called for each member of the object.
     * If a member contains nested objects,
     * the nested objects are transformed before the parent object is.
     */
    replacer?: (this: unknown, key: string, value: unknown) => unknown
}

const defaultOptions: MainStateSyncEnhancerOptions = {}

/**
 * Creates new instance of main process redux enhancer.
 * @param {MainStateSyncEnhancerOptions} options Additional enhancer options
 * @returns StoreEnhancer
 */
export const mainStateSyncEnhancer = (options = defaultOptions): StoreEnhancer => (
    createStore: StoreCreator
) => {
    preventDoubleInitialization()
    const middleware = createMiddleware(options)
    return (reducer, state) => {
        return createStore(reducer, state, applyMiddleware(middleware))
    }
}
