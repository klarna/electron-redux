---
id: getting-started
title: Getting Started with electron-redux
description: 'Introduction > Getting Started: Resources to get started with electron-redux'
hide_title: false
---

electron-redux is a Redux Store Enhancer that helps you loosely synchronize the redux stores in multiple electron processes.

When working with Electron, using Redux poses a couple of problems, since main and renderer processes are isolated and IPC is the only way of communication between them. Electron-redux, allows you to register all your Redux stores in the main & renderer process, and enable cross-process action dispatching & loose store synchronization.

# Installation

`electron-redux` is available as a package on NPM to use with a module bundler:

```sh
# Yarn
yarn add electron-redux@alpha

# NPM
npm install electron-redux@alpha
```

# Configuration

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

You are now ready to fire actions from any of your processes, and depending on the [scope](/introduction/core-concepts#Scoped-actions) the main store will broadcast them across your application.
