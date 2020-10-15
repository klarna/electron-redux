export type CounterState = {
    count: number
}

const init: CounterState = {
    count: 0,
}

const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'

type IncrementAction = {
    type: typeof INCREMENT
}

type DecrementAction = {
    type: typeof DECREMENT
}

export type Actions = IncrementAction | DecrementAction

export const reducer = (state = init, action: Actions): CounterState => {
    switch (action.type) {
        case INCREMENT:
            return { ...state, count: state.count + 1 }
        case DECREMENT:
            return { ...state, count: state.count - 1 }
        default:
            return state
    }
}
