# electron-redux

Using redux with electron poses a couple of problems. Processes ([main](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md#main-process) and [renderer](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md#renderer-process)) are completely isolated, and the only mode of communication is [IPC](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md).

* Where do you keep the state?
* How do you keep the state in sync across processes?


## The solution

`electron-redux` offers an easy to use solution. The redux store on the main process becomes the single source of truth, and stores in the renderer processes become mere proxies. See [under the hood](#under-the-hood).


## Install

```
npm install --save electron-redux
```

`electron-redux` comes as redux middleware that is really easy to apply:

```javascript
import { forwardToMain, forwardToRenderer, triggerAlias } from 'electron-redux';

const todoApp = combineReducers(reducers)

// in the renderer store
const store = createStore(
  todoApp,
  applyMiddleware(
    forwardToMain, // IMPORTANT! This goes first
    ...otherMiddleware,
  )
)

// in the main store
const store = createStore(
  todoApp,
  applyMiddleware(
    triggerAlias, // optional, see below
    ...otherMiddleware,
    forwardToMain, // IMPORTANT! This goes last
  )
)
```

Check out [timesheets](https://github.com/hardchor/timesheets/blob/4ccaf08dee4e1a02850b5bf36e37c537fef7d710/app/shared/store/configureStore.js) for a more advanced example.

And that's it! You are now ready to fire actions without having to worry about synchronising your state between processes.


## Actions

- FSA
- scopes (renderer vs broadcast)


## Aliasing

- what are they?
- how to handle aliased actions


## Under the hood

TODO

- forwardToMain
- forwardToRenderer
- triggerAlias
