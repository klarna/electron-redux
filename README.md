# electron-redux

[![package version](https://img.shields.io/badge/@mckayla%2felectron--redux-v2.0.0-afbdf7.svg)](https://npmjs.com/package/@mckayla/electron-redux)
![stability](https://img.shields.io/badge/stability-release-66f29a.svg)
[![build status](https://github.com/partheseas/electron-redux/workflows/main/badge.svg)](https://github.com/partheseas/electron-redux/actions)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)

## Motivation

Using redux with electron poses a couple of problems. Processes ([main](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md#main-process) and [renderer](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md#renderer-process)) are completely isolated, and the only mode of communication is [IPC](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md).

-   Where do you keep the state?
-   How do you keep the state in sync across processes?

### The solution

`electron-redux` offers an easy to use solution. The redux store on the main process becomes the single source of truth, and stores in the renderer processes become mere proxies. See [under the hood](#under-the-hood).

![electron-redux data flow](https://cloud.githubusercontent.com/assets/307162/20675737/385ce59e-b585-11e6-947e-3867e77c783d.png)



```javascript
// in main
import { syncMain } from "@mckayla/electron-redux";
const store = createStore(reducer, syncMain({
	ignore: []
});
```

```javascript
// in renderer
import { syncRenderer } from "@mckayla/electron-redux";
const store = createStore(reducer, syncRenderer);
```

And that's it! You are now ready to fire actions without having to worry about synchronising your state between processes.

## Actions

Actions fired **MUST** be [FSA](https://github.com/acdlite/flux-standard-action#example)-compliant, i.e. have a `type` and `payload` property. Any actions not passing this test will be ignored and simply passed through to the next middleware.

> NB: `redux-thunk` is not FSA-compliant out of the box, but can still produce compatible actions once the async action fires.

Furthermore, actions (and that includes `payload`s) **MUST** be (de-)serialisable, i.e. either POJOs (simple `object`s - that excludes native JavaScript or DOM objects like `FileList`, `Map`, etc.), `array`s, or primitives. For workarounds, check out [aliased actions](#aliased-actions-main-process)

### Local actions

By default, all actions are played in the main thread and all renderer threads. However, some state should only live in the renderer (e.g. `isPanelOpen`). `electron-redux` introduces the concept of action scopes.

To stop an action from propagating from renderer to main store, simply set the scope to `local`:

```javascript
const myLocalActionCreator = () => ({
	type: "MY_ACTION",
	payload: 123,
	meta: {
		scope: "local",
	},
});
```

We also provide a utility function for this

```
import { stopForwarding } from "@mckayla/electron-redux";
dispatch(stopForwarding(action));
```

### Blacklisted actions

By default actions of certain type (e.g. starting with '@@') are not propagated to the main thread. You can change this behaviour by using `forwardToMainWithParams` function.

## Contributions

Contributions via [issues](https://github.com/hardchor/electron-redux/issues/new) or [pull requests](https://github.com/hardchor/electron-redux/compare) are hugely welcome!

Feel free to let me know whether you're successfully using `electron-redux` in your project and I'm happy to add them here as well!

## Contributors

Special thanks go out to:

-   [Charlie Hess](https://github.com/CharlieHess)
-   [Roman Paradeev](https://github.com/sameoldmadness)
-   Anyone who has contributed by [asking questions & raising issues](https://github.com/hardchor/electron-redux/issues?q=is%3Aissue+is%3Aclosed) 🚀
