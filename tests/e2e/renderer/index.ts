import { createStore } from 'redux'
import { reducer } from '../../counter'
import { rendererStateSyncEnhancer } from '../../../'

const store = createStore(reducer, rendererStateSyncEnhancer())

function mount() {
    document.getElementById('app')!.innerHTML = `
      <p>
        Clicked: <span id="value">0</span> times </br>
        <button id="increment">+</button>
        <button id="decrement">-</button>
      </p>
    `

    document.getElementById('increment')!.addEventListener('click', () => {
        store.dispatch({ type: 'INCREMENT' })
    })

    document.getElementById('decrement')!.addEventListener('click', () => {
        store.dispatch({ type: 'DECREMENT' })
    })
}

function renderValue() {
    document.getElementById('value')!.innerHTML = store.getState().count.toString()
}

mount()
renderValue()

store.subscribe(renderValue)
