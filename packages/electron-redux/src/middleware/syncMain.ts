import { ipcMain, webContents } from "electron";
import { Action, applyMiddleware, Middleware, StoreCreator, StoreEnhancer } from "redux";

import { stopForwarding, validateAction } from "../helpers";

const freeze = (_: string, value: unknown): unknown => {
	if (value instanceof Map) {
		const obj = Object.fromEntries(value);
		obj.__hydrate_type = "__hydrate_map";
		return obj;
	} else if (value instanceof Set) {
		return {
			__hydrate_type: "__hydrate_set",
			items: Array.from(value),
		};
	}

	return value;
};

export const syncMain_internalMiddleware: Middleware = (store) => {
	ipcMain.handle("mckayla.electron-redux.FETCH_STATE", async () => {
		return JSON.stringify(store.getState(), freeze);
	});

	ipcMain.on("mckayla.electron-redux.ACTION", (event, action: Action) => {
		store.dispatch(stopForwarding(action));
	});

	return (next) => (action) => {
		if (validateAction(action)) {
			webContents.getAllWebContents().forEach((contents) => {
				contents.send("mckayla.electron-redux.ACTION", action);
			});
		}
			
		console.log('action:', action);
		return next(action);
	};
};

export const syncMain: StoreEnhancer = (createStore: StoreCreator) => {
	return (reducer, state) => {
		return createStore(
			reducer,
			state,
			applyMiddleware(syncMain_internalMiddleware),
		);
	};
};
