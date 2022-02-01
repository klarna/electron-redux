import { ipcRenderer } from 'electron'
import { IPCEvents } from '../constants'
import { RendererStateSyncEnhancerOptions } from '../options/RendererStateSyncEnhancerOptions'

export async function fetchInitialStateAsync(
    options: RendererStateSyncEnhancerOptions,
    callback: (state: unknown) => void
): Promise<void> {
    // Electron will throw an error if there isn't a handler for the channel.
    // We catch it so that we can throw a more useful error
    try {
        const state = await ipcRenderer.invoke(IPCEvents.INIT_STATE_ASYNC)
        callback(JSON.parse(state, options.deserializer))
    } catch (error) {
        console.warn(error)
        throw new Error(
            'No Redux store found in main process. Did you use the mainStateSyncEnhancer in the MAIN process?'
        )
    }
}
