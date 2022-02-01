---
id: version-1-x
title: Version 1.x documentation
description: 'Version 1.x > Legacy documentation'
hide_title: true
---

# electron-redux v1.x

This is documentation (as in README file) that has been shipped with v1 - since it might be still useful for someone to debug existing applications, entire content is shared here.

Version 1.x is no longer maintainer, and we encurage you to try out the all new shiny v2! Please check our [migration guide](/v1/migrating-from-v1-to-v2) to understand how you can upgrade your app to the latest!

## Motivation

Using redux with electron poses a couple of problems. Processes ([main](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md#main-process) and [renderer](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md#renderer-process)) are completely isolated, and the only mode of communication is [IPC](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md).

-   Where do you keep the state?
-   How do you keep the state in sync across processes?

### The solution

`electron-redux` offers an easy to use solution. The redux store on the main process becomes the single source of truth, and stores in the renderer processes become mere proxies. See [under the hood](#under-the-hood).

![electron-redux basic](https://cloud.githubusercontent.com/assets/307162/20675737/385ce59e-b585-11e6-947e-3867e77c783d.png)

## Install

```
npm install --save electron-redux
```

`electron-redux` comes as redux middleware that is really easy to apply:

```javascript
// in the main store
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux'

const todoApp = combineReducers(reducers)

const store = createStore(
    todoApp,
    initialState, // optional
    applyMiddleware(
        triggerAlias, // optional, see below
        ...otherMiddleware,
        forwardToRenderer // IMPORTANT! This goes last
    )
)

replayActionMain(store)
```

```javascript
// in the renderer store
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux'

const todoApp = combineReducers(reducers)
const initialState = getInitialStateRenderer()

const store = createStore(
    todoApp,
    initialState,
    applyMiddleware(
        forwardToMain, // IMPORTANT! This goes first
        ...otherMiddleware
    )
)

replayActionRenderer(store)
```

Check out [timesheets](https://github.com/hardchor/timesheets/blob/4991fd472dbb12b0c6e6806c6a01ea3385ab5979/app/shared/store/configureStore.js) for a more advanced example.

And that's it! You are now ready to fire actions without having to worry about synchronising your state between processes.

## Actions

Actions fired **MUST** be [FSA](https://github.com/acdlite/flux-standard-action#example)-compliant, i.e. have a `type` and `payload` property. Any actions not passing this test will be ignored and simply passed through to the next middleware.

> NB: `redux-thunk` is not FSA-compliant out of the box, but can still produce compatible actions once the async action fires.

Furthermore, actions (and that includes `payload`s) **MUST** be (de-)serialisable, i.e. either POJOs (simple `object`s - that excludes native JavaScript or DOM objects like `FileList`, `Map`, etc.), `array`s, or primitives. For workarounds, check out [aliased actions](#aliased-actions-main-process)

### Local actions (renderer process)

By default, all actions are being broadcast from the main store to the renderer processes. However, some state should only live in the renderer (e.g. `isPanelOpen`). `electron-redux` introduces the concept of action scopes.

To stop an action from propagating from renderer to main store, simply set the scope to `local`:

```javascript
function myLocalActionCreator() {
    return {
        type: 'MY_ACTION',
        payload: 123,
        meta: {
            scope: 'local',
        },
    }
}
```

### Aliased actions (main process)

Most actions will originate from the renderer side, but not all should be executed there as well. A great example is fetching of data from an external source, e.g. using [promise middleware](https://github.com/acdlite/redux-promise), which should only ever be executed once (i.e. in the main process). This can be achieved using the `triggerAlias` middleware mentioned [above](#install).

Using the `createAliasedAction` helper, you can quite easily create actions that are are only being executed in the main process, and the result of which is being broadcast to the renderer processes.

```javascript
import { createAliasedAction } from 'electron-redux'

export const importGithubProjects = createAliasedAction(
    'IMPORT_GITHUB_PROJECTS', // unique identifier
    (accessToken, repoFullName) => ({
        type: 'IMPORT_GITHUB_PROJECTS',
        payload: importProjects(accessToken, repoFullName),
    })
)
```

Check out [timesheets](https://github.com/hardchor/timesheets/blob/4ccaf08dee4e1a02850b5bf36e37c537fef7d710/app/shared/actions/github.js) for more examples.

### Blacklisted actions

By default actions of certain type (e.g. starting with '@@') are not propagated to the main thread. You can change this behaviour by using `forwardToMainWithParams` function.

```javascript
// in the renderer store
import {
    forwardToMainWithParams,
    replayActionRenderer,
    getInitialStateRenderer,
} from 'electron-redux'

const todoApp = combineReducers(reducers)
const initialState = getInitialStateRenderer()

const store = createStore(
    todoApp,
    initialState,
    applyMiddleware(
        forwardToMainWithParams(), // IMPORTANT! This goes first
        ...otherMiddleware
    )
)

replayActionRenderer(store)
```

You can specify patterns for actions that should not be propagated to the main thread.

```javascript
forwardToMainWithParams({
    blacklist: [/^@@/, /^redux-form/],
})
```

## F.A.Q

### `electron-redux` crashes with electron 10.x

As of Electron 10, the `remote` module is removed by default.

We can get it back by adding `enableRemoteModule=true` to the `webPreferences`:

```js
const w = new BrowserWindow({
    webPreferences: {
        enableRemoteModule: true,
    },
})
```
