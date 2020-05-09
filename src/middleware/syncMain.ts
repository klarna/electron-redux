import debug from "debug";
import { ipcMain, webContents } from "electron";
import {
	Action,
	applyMiddleware,
	Middleware,
	StoreCreator,
	StoreEnhancer,
} from "redux";

const log = debug("mckayla.electron-redux.sync");

import { stopForwarding, validateAction } from "../helpers";

let previouslyInitialzed: Error;

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

const middleware: Middleware = (store) => {
	ipcMain.handle("mckayla.electron-redux.FETCH_STATE", async () => {
		return JSON.stringify(store.getState(), freeze);
	});

	ipcMain.on("mckayla.electron-redux.ACTION", (event, action: Action) => {
		store.dispatch(stopForwarding(action));
	});

	// We are intentionally not actually throwing the error here, we just
	// want to capture the call stack for debugging.
	previouslyInitialzed = new Error("Previously attached to a store at");

	return (next) => (action) => {
		if (validateAction(action)) {
			log("forwarding following action to renderers");
			webContents.getAllWebContents().forEach((contents) => {
				contents.send("mckayla.electron-redux.ACTION", action);
			});
		}

		log("action:", action);
		return next(action);
	};
};

export const syncMain: StoreEnhancer = (createStore: StoreCreator) => {
	if (previouslyInitialzed) {
		console.error(
			new Error("electron-redux has already been attached to a store"),
		);
		console.error(previouslyInitialzed);
	}

	return (reducer, state) => {
		return createStore(reducer, state, applyMiddleware(middleware));
	};
};
