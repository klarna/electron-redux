export type CounterState = {
    count: number
}

const init: CounterState = {
    count: 0,
}

const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'
const SET_COUNT_MIDDLEWARE = 'SET_COUNT_MIDDLEWARE'

type IncrementAction = {
    type: typeof INCREMENT
}

type DecrementAction = {
    type: typeof DECREMENT
}

type SetCountMiddlewareAction = {
    type: typeof SET_COUNT_MIDDLEWARE
    payload: number
}

export type Actions = IncrementAction | DecrementAction | SetCountMiddlewareAction

export const reducer = (state = init, action: Actions): CounterState => {
    switch (action.type) {
        case INCREMENT:
            return { ...state, count: state.count + 1 }
        case DECREMENT:
            return { ...state, count: state.count - 1 }
        case SET_COUNT_MIDDLEWARE:
            return { ...state, count: action.payload }
        default:
            return state
    }
}
