import { ipcRenderer } from 'electron'
import { INIT_STATE_ASYNC } from '../constants'
import { RendererStateSyncEnhancerOptions } from '../options/RendererStateSyncEnhancerOptions'

async function fetchInitialStateAsync(
    options: RendererStateSyncEnhancerOptions,
    callback: (state: unknown) => void
): Promise<void> {
    // Electron will throw an error if there isn't a handler for the channel.
    // We catch it so that we can throw a more useful error
    const state = await ipcRenderer.invoke(INIT_STATE_ASYNC).catch((error) => {
        console.warn(error)
        throw new Error(
            'No Redux store found in main process. Did you use the mainStateSyncEnhancer in the MAIN process?'
        )
    })

    callback(JSON.parse(state, options.reviver))
}

export default fetchInitialStateAsync
