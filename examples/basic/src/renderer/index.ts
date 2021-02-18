/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createStore } from 'redux'
import { rootReducer } from '../store'
import { stateSyncEnhancer } from 'electron-redux'
import {
    decrementGlobalCounter,
    decrementLocalCounter,
    incrementGlobalCounter,
    incrementLocalCounter,
} from '../store/actions'

const store = createStore(rootReducer, stateSyncEnhancer())

const globalCounterEl = document.getElementById('globalCounter')!
document
    .getElementById('incrementGlobalCounter')!
    .addEventListener('click', () => store.dispatch(incrementGlobalCounter()))
document
    .getElementById('decrementGlobalCounter')!
    .addEventListener('click', () => store.dispatch(decrementGlobalCounter()))

const localCounterEl = document.getElementById('localCounter')!
document
    .getElementById('incrementLocalCounter')!
    .addEventListener('click', () => store.dispatch(incrementLocalCounter()))
document
    .getElementById('decrementLocalCounter')!
    .addEventListener('click', () => store.dispatch(decrementLocalCounter()))

const render = () => {
    const { globalCounter, localCounter } = store.getState()
    globalCounterEl.innerHTML = globalCounter.toString()
    localCounterEl.innerHTML = localCounter.toString()
}

store.subscribe(render)
render() // initial render
