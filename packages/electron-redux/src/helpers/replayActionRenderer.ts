import { ipcRenderer } from "electron";
import { Action, Store } from "redux";

export default function replayActionRenderer<TState, TAction extends Action>(
	store: Store<TState, TAction>,
) {
	ipcRenderer.on(
		"mckayla.electron-redux.ACTION",
		(event, payload: TAction) => {
			store.dispatch(payload);
		},
	);
}
