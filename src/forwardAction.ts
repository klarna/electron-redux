import { ipcRenderer, webContents } from 'electron'
import { Store } from 'redux'
import { IPCEvents } from './constants'
import { MainStateSyncEnhancerOptions } from './options/MainStateSyncEnhancerOptions'
import { RendererStateSyncEnhancerOptions } from './options/RendererStateSyncEnhancerOptions'
import { StateSyncOptions } from './options/StateSyncOptions'
import { isMain, isRenderer, validateAction } from './utils'

export const processActionMain = <A>(
    action: A,
    options: MainStateSyncEnhancerOptions = {}
): void => {
    if (validateAction(action, options.denyList)) {
        webContents.getAllWebContents().forEach((contents) => {
            // Ignore chromium devtools
            if (contents.getURL().startsWith('devtools://')) return
            contents.send(IPCEvents.ACTION, action)
        })
    }
}

export const processActionRenderer = <A>(
    action: A,
    options: RendererStateSyncEnhancerOptions = {}
): void => {
    if (validateAction(action, options.denyList)) {
        ipcRenderer.send(IPCEvents.ACTION, action)
    }
}

export const forwardAction = <S extends Store<any, any>>(
    store: S,
    options?: StateSyncOptions
): S => {
    return {
        ...store,
        dispatch: (action) => {
            const value = store.dispatch(action)

            if (!options?.preventActionReplay) {
                if (isMain) {
                    processActionMain(action, options)
                } else if (isRenderer) {
                    processActionRenderer(action, options)
                }
            }

            return value
        },
    }
}
