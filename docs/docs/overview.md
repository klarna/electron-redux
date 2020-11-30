---
id: overview
title: Overview
sidebar_label: Overview
slug: /
---

## Motivation

In Electron, the ([main](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md#main-process) and [renderer](https://github.com/electron/electron/blob/master/docs/tutorial/quick-start.md#renderer-process)) processes are completely isolated, and the only mode of communication is through [IPC](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md). When using Redux with Electron, this poses a couple of problems:
- Where do you keep the state?
- How do you keep the state in sync across processes?

`electron-redux` offers an easy to use solution. The redux store on the main process becomes the single source of truth, and stores in the renderer processes become mere proxies:

![electron-redux basic](https://cloud.githubusercontent.com/assets/307162/20675737/385ce59e-b585-11e6-947e-3867e77c783d.png)

## Installation

`TODO: add minimum Node version`

```shell
# npm 
$ npm install electron-redux

# yarn 
$ yarn add electron-redux
```

## Usage

`electron-redux` comes a easy to use redux middleware that is applied to both main and renderer stores.

### Main Store

```javascript
import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux';

const todoApp = combineReducers(reducers);

const store = createStore(
  todoApp,
  initialState, // optional
  applyMiddleware(
    triggerAlias, // optional, see below
    ...otherMiddleware,
    forwardToRenderer, // IMPORTANT! This goes last
  ),
);

replayActionMain(store);
```

### Renderer Store

```javascript
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';

const todoApp = combineReducers(reducers);
const initialState = getInitialStateRenderer();

const store = createStore(
  todoApp,
  initialState,
  applyMiddleware(
    forwardToMain, // IMPORTANT! This goes first
    ...otherMiddleware,
  ),
);

replayActionRenderer(store);
```