---
id: faq-general
title: Frequently Asked Questions
description: 'FAQ > General'
hide_title: true
---

# TODO

## Errors

### Received error "electron-redux has already been attached to a store"

There are 2 scenario's for you to receive this error message.

1. If you are using the `composeWithStateSync` function to install electron-redux, you do not need to manually add the `stateSyncEnhancer` as it does the same thing. It will throw an error if you try.
2. If you are using `stateSyncEnhancer`, `rendererStateSyncEnhancer` or `mainStateSyncEnhancer` in your createStore function, you may only add one of these in EACH process.

### Received error "Unsupported process: process.type = ..."

If you use `composeWithStateSync` or `stateSyncEnhancer`, we will determine in which process you are, the main or renderer process. We do this by checking the [process.type](https://www.electronjs.org/docs/api/process#processtype-readonly) variable which has been set by Electron. If you receive this error, you are either using this package in a non-supported environment, or this variable is not set properly
