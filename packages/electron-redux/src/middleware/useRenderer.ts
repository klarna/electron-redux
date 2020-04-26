import { ipcRenderer } from "electron";
import { Action, Middleware } from "redux";
import { validateAction } from "../helpers/validateAction";

type ActionMeta = {
	scope?: "local" | string;
};

// eslint-disable-next-line consistent-return, no-unused-vars
export const forwardToMainWithParams = (
	params = { blacklist: [] },
): Middleware => (store) => (next) => (action) => {
	const { blacklist = [] } = params;
	if (!validateAction<unknown, ActionMeta>(action)) return next(action);
	if (action.meta && action.meta.scope === "local") return next(action);

	if (blacklist.some((rule) => rule.test(action.type))) {
		return next(action);
	}

	// stop action in-flight
	ipcRenderer.send("redux-action", action);
};

export const useRenderer: Middleware = (store) => {
	ipcRenderer.on(
		"mckayla.electron-redux.ACTION",
		(event, payload: Action) => {
			store.dispatch(payload);
		},
	);

	return (next) => (action) => {
		const blacklist = [/^@@/, /^redux-form/];
		if (!validateAction < action) return next(action);
		if (action.meta && action.meta.scope === "local") return next(action);

		if (blacklist.some((rule) => rule.test(action.type))) {
			return next(action);
		}

		ipcRenderer.send("mckayla.electron-redux.ACTION", action);
	};
};
