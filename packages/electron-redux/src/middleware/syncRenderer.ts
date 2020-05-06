import { ipcRenderer } from "electron";
import {
	Action,
	applyMiddleware,
	Middleware,
	Reducer,
	StoreCreator,
	StoreEnhancer,
} from "redux";
import { stopForwarding, validateAction } from "../helpers";

const hydrate = (_: string, value: any) => {
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

const replaceState = <S>(state: S) => ({
	type: "mckayla.electron-redux.REPLACE_STATE" as const,
	payload: state,
	meta: { scope: "local" },
});

type InternalAction = ReturnType<typeof replaceState>;

const wrapReducer = (yourReducer: Reducer) => <S, A extends Action>(
	state: S,
	action: InternalAction | A,
) => {
	switch (action.type) {
		case "mckayla.electron-redux.REPLACE_STATE":
			return (action as InternalAction).payload;
		default:
			return yourReducer(state, action);
	}
};

export const syncRenderer: StoreEnhancer = (createStore: StoreCreator) => {
	return (reducer, state) => {
		const store = createStore(
			wrapReducer(reducer),
			state,
			applyMiddleware(syncRenderer_internalMiddleware),
		);

		getRendererState().then((state) => store.dispatch(replaceState(state)));

		// TypeScript is fucking dumb. If you return the call to createStore
		// immediately it's fine, but even assigning it to a constant and returning
		// will make it freak out.
		return (store as unknown) as any;
	};
};

const syncRenderer_internalMiddleware: Middleware = (store) => {
	console.log("this is the store log", store);

	ipcRenderer.on(
		"mckayla.electron-redux.ACTION",
		(event, action: Action) => {
			store.dispatch(stopForwarding(action));
		},
	);

	return (next) => (action) => {
		if (validateAction(action)) {
			ipcRenderer.send("mckayla.electron-redux.ACTION", action);
		}

		console.log('action:', action);
			return next(action);
	};
};
