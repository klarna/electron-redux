import { Store } from 'redux'
import { StateSyncOptions } from '../options/StateSyncOptions'

export type ProcessForwarder = (forwarderAction: any, forwarderOptions: StateSyncOptions) => void

export const forwardAction = <S extends Store<any, any>>(
    store: S,
    processForwarder: ProcessForwarder,
    options: StateSyncOptions = {}
): S => {
    return {
        ...store,
        dispatch: (action) => {
            const value = store.dispatch(action)

            if (!options?.preventActionReplay) {
                processForwarder(action, options)
            }

            return value
        },
    }
}
