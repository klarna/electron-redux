import { ipcRenderer } from 'electron'
import { INIT_STATE } from '../constants'
import { RendererStateSyncEnhancerOptions } from '../options/RendererStateSyncEnhancerOptions'

function fetchInitialState<T>(options: RendererStateSyncEnhancerOptions): T {
    const state = ipcRenderer.sendSync(INIT_STATE)
    return JSON.parse(state, options.reviver)
}

export default fetchInitialState
