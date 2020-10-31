import { ipcRenderer } from 'electron'
import { IPCEvents } from '../constants'
import { RendererStateSyncEnhancerOptions } from '../options/RendererStateSyncEnhancerOptions'

function fetchInitialState<T>(options: RendererStateSyncEnhancerOptions): T {
    const state = ipcRenderer.sendSync(IPCEvents.INIT_STATE)
    return JSON.parse(state, options.reviver)
}

export default fetchInitialState
