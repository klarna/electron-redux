import { applyMiddleware, compose, createStore } from 'redux'
import { reducer } from '../../counter'
import { rendererStateSyncEnhancer } from '../../../'
import { countMiddleware } from '../../middleware'
import { ipcRenderer } from 'electron'

const middleware = applyMiddleware(countMiddleware)
const enhancer = compose(middleware, rendererStateSyncEnhancer())

const store = createStore(reducer, enhancer)

function mount() {
    document.getElementById('app')!.innerHTML = `
      <p>
        Clicked: <span id="value">0</span> times </br>
        <button id="increment">+</button>
        <button id="decrement">-</button>

        <button id="setCountMiddleware">#</button>
        <button id="mainsetCountMiddleware">#</button>
        <button id="mainIncrement">#</button>
      </p>
    `

    document.getElementById('increment')!.addEventListener('click', () => {
        store.dispatch({ type: 'INCREMENT' })
    })

    document.getElementById('decrement')!.addEventListener('click', () => {
        store.dispatch({ type: 'DECREMENT' })
    })

    document.getElementById('setCountMiddleware')!.addEventListener('click', () => {
        store.dispatch({ type: 'SET_COUNT_MIDDLEWARE', payload: 9 })
    })
    document.getElementById('mainsetCountMiddleware')!.addEventListener('click', () => {
        ipcRenderer.send('mainsetCountMiddleware')
    })
    document.getElementById('mainIncrement')!.addEventListener('click', () => {
        ipcRenderer.send('mainIncrement')
    })
}

function renderValue() {
    document.getElementById('value')!.innerHTML = store.getState().count.toString()
}

mount()
renderValue()

store.subscribe(renderValue)
