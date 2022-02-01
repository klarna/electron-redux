import { webContents } from 'electron'
import { IPCEvents } from 'src/constants'
import { MainStateSyncEnhancerOptions } from 'src/options/MainStateSyncEnhancerOptions'
import { validateAction } from 'src/utils'

export const forwardActionToRenderers = <A>(
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
