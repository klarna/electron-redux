# electron-redux

[![build status](https://github.com/partheseas/electron-redux/workflows/main/badge.svg)](https://github.com/partheseas/electron-redux/actions)
[![package version](https://mckay.la/vbadge/@mckayla%2Felectron-redux/afbdf7)](https://npmjs.com/package/@mckayla/electron-redux)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)

![electron-redux data flow](https://cloud.githubusercontent.com/assets/307162/20675737/385ce59e-b585-11e6-947e-3867e77c783d.png)

Keeps your state in sync across all of your Electron processes by playing your actions
in all of them.

```javascript
// in the main process
import { syncMain } from "@mckayla/electron-redux";
const store = createStore(reducer, syncMain);
```

```javascript
// in the renderer processes
import { syncRenderer } from "@mckayla/electron-redux";
const store = createStore(reducer, syncRenderer);
```

That's it! Just add these enhancers to where you initialize your store. As long
as your reducers are pure/deterministic (which they already should be) your state
should be reproduced accurately across all of the processes.

## Actions

Actions **MUST** be [FSA](https://github.com/acdlite/flux-standard-action#example)-compliant,
i.e. have a `type` and `payload` property. Any actions not passing this test will
be ignored and simply passed through to the next middleware.

> NB: `redux-thunk` is not FSA-compliant out of the box, but can still produce compatible actions once the async action fires.

Actions **MUST** be serializable

-   Objects with enumerable properties
-   Arrays
-   Numbers
-   Booleans
-   Strings
-   Maps
-   Sets

### Local actions

By default, all actions are played in all processes. If an action should only be
played in the current thread, then you can set the scope meta property to local.

```javascript
const myLocalActionCreator = () => ({
	type: "MY_ACTION",
	payload: 123,
	meta: {
		scope: "local", // only play the action locally
	},
});
```

We also provide a utility function for this

```
import { stopForwarding } from "@mckayla/electron-redux";
dispatch(stopForwarding(action));
```

## Contributors

-   [Burkhard Reffeling](https://github.com/hardchor)
-   [Charlie Hess](https://github.com/CharlieHess)
-   [Roman Paradeev](https://github.com/sameoldmadness)
