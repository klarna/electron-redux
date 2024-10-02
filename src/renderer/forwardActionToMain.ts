import { ipcRenderer } from 'electron'
import { IPCEvents } from '../constants'
import { RendererStateSyncEnhancerOptions } from '../options/RendererStateSyncEnhancerOptions'
import { validateAction } from '../utils'

export const forwardActionToMain = <A>(
    action: A,
    options: RendererStateSyncEnhancerOptions = {}
): void => {
    if (validateAction(action, options.denyList)) {
        ipcRenderer.send(IPCEvents.ACTION, action)
    }
}
