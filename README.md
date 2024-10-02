# electron-redux

Electron-Redux is an Redux Store Enhancer that helps you loosely synchronize the redux stores in multiple electron processes.

When working with Electron, using Redux poses couple of problems, since main and renderer processes are isolated and IPC is a single way of communication between them. This library, enables you to register all your Redux stores in the main & renderer process, and enable cross-process action dispatching & _loose_ store synchronization.

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/klarna/electron-redux/Release)](https://github.com/klarna/electron-redux/actions?query=workflow%3ARelease)
[![npm (tag)](https://img.shields.io/npm/v/electron-redux)](https://www.npmjs.com/package/electron-redux/)
[![npm](https://img.shields.io/npm/dm/electron-redux)](https://www.npmjs.com/package/electron-redux/)
[![npm bundle size (version)](https://img.shields.io/bundlephobia/minzip/electron-redux)](https://bundlephobia.com/result?p=electron-redux)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

## Installation

```sh
# with yarn
yarn add electron-redux

# with npm
npm install electron-redux
```

For more details, please see [the Installation docs page](#todo).

## Documentation

electron-redux docs are located at **electron-redux.js.org**. You can find there:

-   [Getting started](#todo)
-   [Recipes](#todo)
-   [API Reference](#todo)

## Quick start

### Basic setup

If you have a setup without any enhancers, also including middleware, you can use the basic setup. For the basic setup, electron redux exposes a [Redux StoreEnhancer](https://redux.js.org/understanding/thinking-in-redux/glossary#store-enhancer). You simply add the enhancer to your createStore function to set it up.

```ts
// main.ts
import { stateSyncEnhancer } from 'electron-redux'

const store = createStore(reducer, stateSyncEnhancer())
```

```ts
// renderer.ts
import { stateSyncEnhancer } from 'electron-redux'

const store = createStore(reducer, stateSyncEnhancer())
```

### Multi-enhancer setup

> This setup is required when you have other enhancers/middleware. This is especially the case for enhancers or middleware which dispatch actions, such as **redux-saga** and **redux-observable**

For this setup we will use the `composeWithStateSync` function. This function is created to wrap around your enhancers, just like the [compose](https://redux.js.org/api/compose) function from redux. When using this, you will not need `stateSyncEnhancer` as this does the same thing under the hood. If you do, it will throw an error.

```ts
import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithStateSync } from 'electron-redux'

const middleware = applyMiddleware(...middleware)

// add other enhances here if you have any, works like `compose` from redux
const enhancer: StoreEnhancer = composeWithStateSync(middleware /* ... other enhancers ... */)

const store = createStore(reducer, enhancer)
```

That's it!

You are now ready to fire actions from any of your processes, and depending on the [scope](#scoped-actions) the main store will broadcast them across your application.

Please check out the [docs](#todo) for more recipes and examples!

## Actions

Actions fired **MUST be [FSA](https://github.com/acdlite/flux-standard-action#example)-compliant**, i.e. have a `type` and `payload` property. Any actions not passing this test will be ignored and simply passed through to the next middleware.

> Nota bene, `redux-thunk` is not FSA-compliant out of the box, but can still produce compatible actions once the async action fires.

Furthermore, actions (and that includes payloads) **MUST be serializable**.

> You can extend default JSON serialization used, by [providing your own serialization/deserialization functions](#todo).

### Scoped actions

By default, all actions are broadcast to all registered stores. However, some state should only live in the renderer (e.g. `isPanelOpen`). electron-redux introduces the concept of action scopes.

To stop an action from propagating from renderer to main store, simply set the scope to local by decorating your action with `stopForwarding` function. Read more about it in the [docs](#todo)

### Blocked actions

By default, some of the actions are blocked from broadcasting / propagating, those include actions starting with `@@` and `redux-form`. The list of ignored actions can be modified with [options](#todo).

## Changelog

This project adheres to [Semantic Versioning](http://semver.org/).
Every release, along with the migration instructions, is documented on the GitHub [Releases](https://github.com/klarna/electron-redux/releases) page.

## Contributing

Contributions via [issues](https://github.com/klarna/electron-redux/issues/new) or [pull requests](https://github.com/klarna/electron-redux/compare) are hugely welcome! Remember to read our [contributing guidelines](.github/CONTRIBUTING.md) to get started!

By contributing to electron-redux, you agree to abide by [the code of conduct](.github/CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE.md)
