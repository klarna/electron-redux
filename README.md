# @getstation/electron-redux
[![CircleCI](https://circleci.com/gh/getstation/electron-redux/tree/master.svg?style=svg)](https://circleci.com/gh/getstation/electron-redux/tree/master)

- [Motivation](#motivation)
- [Install](#install)
- [Actions](#local-actions-renderer-process)
	- [Local actions (renderer process)](#local-actions-renderer-process)
	- [Aliased actions (main process)](#aliased-actions-main-process)

## Differences with trunk repo
- This fork doesn't enforce [FSA](https://github.com/acdlite/flux-standard-action#example)
- Support for ImmutableJS but drop of support for POJSO
- Change dispatch execution order: the process from where the action is dispatched reduces action immediately instead of waiting for the the main to dispatch action in other processes.

## Motivation

Using redux with electron poses a couple of problems. Processes ([main](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md#main-process) and [renderer](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md#renderer-process)) are completely isolated, and the only mode of communication is [IPC](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md).

* Where do you keep the state?
* How do you keep the state in sync across processes?


### The solution

`electron-redux` offers an easy to use solution. The redux store on the main process becomes the single source of truth, and stores in the renderer processes become mere proxies. See [under the hood](#under-the-hood).

![electron-redux basic](https://cloud.githubusercontent.com/assets/307162/20675737/385ce59e-b585-11e6-947e-3867e77c783d.png)

## Install

```
npm install --save @getstation/electron-redux
```

`@getstation/electron-redux` comes as redux middleware that is really easy to apply:

```javascript
// in the main store
import {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
} from 'electron-redux';

const todoApp = combineReducers(reducers);

const store = createStore(
  todoApp,
  initialState, // optional
  applyMiddleware(
    triggerAlias, // optional, see below
    ...otherMiddleware,
    forwardToRenderer, // IMPORTANT! This goes last
  )
);

replayActionMain(store);
```

```javascript
// in the renderer store
import {
  forwardToMain,
  replayActionRenderer,
  getInitialStateRenderer,
} from '@getstation/electron-redux';

const todoApp = combineReducers(reducers);
const initialState = getInitialStateRenderer();

const store = createStore(
  todoApp,
  initialState,
  applyMiddleware(
    forwardToMain, // IMPORTANT! This goes first
    ...otherMiddleware,
  )
);

replayActionRenderer(store);
```

Check out [timesheets](https://github.com/hardchor/timesheets/blob/4991fd472dbb12b0c6e6806c6a01ea3385ab5979/app/shared/store/configureStore.js) for a more advanced example.

And that's it! You are now ready to fire actions without having to worry about synchronising your state between processes.


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
  };
}
```


### Aliased actions (main process)

Most actions will originate from the renderer side, but not all should be executed there as well. A great example is fetching of data from an external source, e.g. using [promise middleware](https://github.com/acdlite/redux-promise), which should only ever be executed once (i.e. in the main process). This can be achieved using the `triggerAlias` middleware mentioned [above](#install).

Using the `createAliasedAction` helper, you can quite easily create actions that are are only being executed in the main process, and the result of which is being broadcast to the renderer processes.

```javascript
import { createAliasedAction } from 'electron-redux';

export const importGithubProjects = createAliasedAction(
  'IMPORT_GITHUB_PROJECTS', // unique identifier
  (accessToken, repoFullName) => ({
    type: 'IMPORT_GITHUB_PROJECTS',
    payload: importProjects(accessToken, repoFullName),
  })
);
```

Check out [timesheets](https://github.com/hardchor/timesheets/blob/4ccaf08dee4e1a02850b5bf36e37c537fef7d710/app/shared/actions/github.js) for more examples.
