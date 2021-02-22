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

/*
    INCREMENT_LOCAL action is an Scoped Action - that means, that it will not get propagated to any other store in other processes: 
    it will only get handled by the middleware & reducers registered for the process it got dispatch in.

    To create such an action, we have used the stopForwarding function wrapper on top of the action itself
*/
export const INCREMENT_LOCAL = 'INCREMENT_LOCAL'
export const incrementLocalCounter = (): ActionTypes => stopForwarding({ type: INCREMENT_LOCAL })

/*
    DECREMENT_LOCAL action is an Scoped Action - that means, that it will not get propagated to any other store in other processes: 
    it will only get handled by the middleware & reducers registered for the process it got dispatch in.

    Here, instead of using the helper function from electron-redux, we set the scoping property manually, by adding additional meta field with scope value set to local:
*/
export const DECREMENT_LOCAL = 'DECREMENT_LOCAL'
export const decrementLocalCounter = (): ActionWithMeta => ({
    type: DECREMENT_LOCAL,
    meta: { scope: 'local' },
})
