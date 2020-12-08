import { ipcMain, webContents } from 'electron'
import {
    Action,
    compose,
    Dispatch,
    Middleware,
    MiddlewareAPI,
    StoreCreator,
    StoreEnhancer,
} from 'redux'
import { IPCEvents } from './constants'
import {
    defaultMainOptions,
    MainStateSyncEnhancerOptions,
} from './options/MainStateSyncEnhancerOptions'
import { preventDoubleInitialization, stopForwarding, validateAction } from './utils'

function createMiddleware(options: MainStateSyncEnhancerOptions) {
    const middleware: Middleware = (store) => {
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

        return (next) => (action) => {
            if (validateAction(action, options.denyList)) {
                webContents.getAllWebContents().forEach((contents) => {
                    // Ignore chromium devtools
                    if (contents.getURL().startsWith('devtools://')) return
                    contents.send(IPCEvents.ACTION, action)
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
    return (reducer, preloadedState) => {
        const store = createStore(reducer, preloadedState)

        let dispatch = store.dispatch

        const middlewareAPI: MiddlewareAPI<Dispatch<any>> = {
            getState: store.getState,
            dispatch,
        }

        dispatch = compose<Dispatch>(middleware(middlewareAPI))(store.dispatch)

        return {
            ...store,
            dispatch,
        }
    }
}
