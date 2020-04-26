import { ipcMain, webContents } from "electron";
import { Action, Middleware } from "redux";

import { validateAction } from "../helpers/validateAction";

type ActionMeta = {
	scope?: "local" | string;
};

const freezeDry = (key: string, value: unknown): unknown => {
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

export const useMain: Middleware = (store) => {
	ipcMain.handle("mckayla.electron-redux.FETCH_STATE", async () => {
		return JSON.stringify(store.getState(), freezeDry);
	});

	ipcMain.on("mckayla.electron-redux.ACTION", (event, payload: Action) => {
		store.dispatch(payload);
	});

	return (next) => (action) => {
		if (!validateAction<unknown, ActionMeta>(action)) return next(action);
		if (action.meta?.scope === "local") return next(action);

		// change scope to avoid endless-loop
		const rendererAction = {
			...action,
			meta: {
				...action.meta,
				scope: "local",
			},
		};

		const allWebContents = webContents.getAllWebContents();

		allWebContents.forEach((contents) => {
			contents.send("mckayla.electron-redux.ACTION", rendererAction);
		});

		return next(action);
	};
};
