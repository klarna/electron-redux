import {
    DECREMENT_GLOBAL,
    INCREMENT_GLOBAL,
    ActionTypes,
    INCREMENT_LOCAL,
    DECREMENT_LOCAL,
} from './actions'

export const globalCounterReducer = (state = 0, action: ActionTypes): number => {
    switch (action.type) {
        case INCREMENT_GLOBAL: {
            return state + 1
        }
        case DECREMENT_GLOBAL: {
            return state - 1
        }
        default:
            return state
    }
}

export const localCounterReducer = (state = 0, action: ActionTypes): number => {
    switch (action.type) {
        case INCREMENT_LOCAL: {
            return state + 1
        }
        case DECREMENT_LOCAL: {
            return state - 1
        }
        default:
            return state
    }
}
