import { ipcRenderer } from 'electron'
import { IPCEvents } from '../constants'
import { RendererStateSyncEnhancerOptions } from '../options/RendererStateSyncEnhancerOptions'

export function fetchInitialState<T>(options: RendererStateSyncEnhancerOptions): T {
    const state = ipcRenderer.sendSync(IPCEvents.INIT_STATE)
    return JSON.parse(state, options.deserializer)
}
