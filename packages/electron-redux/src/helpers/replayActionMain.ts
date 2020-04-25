import { ipcMain } from "electron";
import { Action, Store } from "redux";

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

export default function replayActionMain<TState, TAction extends Action>(
	store: Store<TState, TAction>,
) {
	ipcMain.handle("mckayla.electron-redux.FETCH_STATE", async () => {
		return JSON.stringify(store.getState(), freezeDry);
	});

	ipcMain.on("mckayla.electron-redux.ACTION", (event, payload: TAction) => {
		store.dispatch(payload);
	});
}
