import { stopForwarding } from 'electron-redux'

export interface ActionTypes {
    type:
        | typeof INCREMENT_GLOBAL
        | typeof DECREMENT_GLOBAL
        | typeof INCREMENT_LOCAL
        | typeof DECREMENT_LOCAL
}

interface ActionWithMeta extends ActionTypes {
    meta: {
        scope: 'local'
    }
}

export const INCREMENT_GLOBAL = 'INCREMENT_GLOBAL'
export const incrementGlobalCounter = (): ActionTypes => ({ type: INCREMENT_GLOBAL })

export const DECREMENT_GLOBAL = 'DECREMENT_GLOBAL'
export const decrementGlobalCounter = (): ActionTypes => ({ type: DECREMENT_GLOBAL })

export const INCREMENT_LOCAL = 'INCREMENT_LOCAL'
export const incrementLocalCounter = (): ActionTypes => stopForwarding({ type: INCREMENT_LOCAL })

export const DECREMENT_LOCAL = 'DECREMENT_LOCAL'
export const decrementLocalCounter = (): ActionWithMeta => ({
    type: DECREMENT_LOCAL,
    meta: { scope: 'local' },
})
