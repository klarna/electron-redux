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
    forwardToRenderer, // IMPORTANT! This goes last
  )
)
```

Check out [timesheets](https://github.com/hardchor/timesheets/blob/4ccaf08dee4e1a02850b5bf36e37c537fef7d710/app/shared/store/configureStore.js) for a more advanced example.

And that's it! You are now ready to fire actions without having to worry about synchronising your state between processes.


## Actions

Actions fired should be [FSA](https://github.com/acdlite/flux-standard-action#example)-compliant, i.e. have a `type` and `payload` property.

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

Most actions will be fired from the renderer side, but not all should be executed there as well. A great example is fetching of data from an external source, e.g. using [promise middleware](https://github.com/acdlite/redux-promise). This can be achieved using the `triggerAlias` middleware mentioned [above](#install).

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



## Under the hood

TODO

- forwardToMain
- forwardToRenderer
- triggerAlias
