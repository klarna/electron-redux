import { ipcRenderer } from "electron";

const hydrate = (key, value) => {
	if (value?.__hydrate_type === "__hydrate_map") {
		return new Map(
			Object.entries(value).filter(([key]) => key !== "__hydrate_type"),
		);
	} else if (value?.__hydrate_type === "__hydrate_set") {
		return new Set(value.items);
	}

	return value;
};

export async function getRendererState() {
	const state = await ipcRenderer.invoke(
		"mckayla.electron-redux.FETCH_STATE",
	);

	if (typeof state !== "string") {
		throw new Error(
			"No Redux store found in main process. Did you apply the middleware?",
		);
	}

	return JSON.parse(state, hydrate);
}
