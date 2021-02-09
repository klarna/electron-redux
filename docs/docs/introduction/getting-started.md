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

electron-redux comes as a [Redux store enhancer](https://redux.js.org/understanding/thinking-in-redux/glossary#store-enhancer). To initialize your stores, you just need to decorate them in the `main` and `renderer` processes of electron with their respective enhancers:

```ts
// main.ts
import { mainStateSyncEnhancer } from 'electron-redux'

const store = createStore(reducer, mainStateSyncEnhancer())
```

```ts
// renderer.ts
import { rendererStateSyncEnhancer } from 'electron-redux'

const store = createStore(reducer, rendererStateSyncEnhancer())
```

That's it!

You are now ready to fire actions from any of your processes, and depending on the [scope](/introduction/core-concepts#Scoped-actions) the main store will broadcast them across your application.
