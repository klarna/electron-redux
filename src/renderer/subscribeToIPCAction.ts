import { ipcRenderer } from 'electron'
import { Action } from 'redux'
import { IPCEvents } from 'src/constants'

export const subscribeToIPCAction = (callback: (action: Action) => void): void => {
    ipcRenderer.on(IPCEvents.ACTION, (_, action: Action) => {
        callback(action)
    })
}
