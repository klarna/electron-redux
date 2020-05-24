import { ipcMain, webContents } from "electron";
import {
	Action,
	applyMiddleware,
	Middleware,
	StoreCreator,
	StoreEnhancer,
} from "redux";

import {
	freeze,
	preventDoubleInitialization,
	stopForwarding,
	validateAction,
} from "../helpers";

const middleware: Middleware = (store) => {
	ipcMain.handle("mckayla.electron-redux.FETCH_STATE", async () => {
		// Stringify the current state, and freeze it to preserve certain types
		// that you might want to use in your state, but aren't JSON serializable
		// by default.
		return JSON.stringify(store.getState(), freeze);
	});

	// When receiving an action from a renderer
	ipcMain.on("mckayla.electron-redux.ACTION", (event, action: Action) => {
		// Play it locally (in main)
		store.dispatch(stopForwarding(action));

		// Forward it to all of the other renderers
		webContents.getAllWebContents().forEach((contents) => {
			// Ignore the renderer that sent the action
			if (contents.id !== event.sender.id) {
				contents.send(
					"mckayla.electron-redux.ACTION",
					stopForwarding(action),
				);
			}
		});
	});

	return (next) => (action) => {
		if (validateAction(action)) {
			webContents.getAllWebContents().forEach((contents) => {
				console.log("contents.id", contents.id);
				contents.send("mckayla.electron-redux.ACTION", action);
			});
		}

		return next(action);
	};
};

export const syncMain: StoreEnhancer = (createStore: StoreCreator) => {
	preventDoubleInitialization();

	return (reducer, state) => {
		return createStore(reducer, state, applyMiddleware(middleware));
	};
};
