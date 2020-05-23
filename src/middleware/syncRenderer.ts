import { ipcRenderer } from "electron";
import {
	Action,
	applyMiddleware,
	Middleware,
	Reducer,
	StoreCreator,
	StoreEnhancer,
} from "redux";

import {
	preventDoubleInitialization,
	stopForwarding,
	validateAction,
} from "../helpers";

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

export async function getRendererState(callback: (state: unknown) => void) {
	const state = await ipcRenderer.invoke(
		"mckayla.electron-redux.FETCH_STATE",
	);

	// TODO: I don't think this is the right error handling anymore
	if (typeof state !== "string") {
		throw new Error(
			"No Redux store found in main process. Did you apply the middleware?",
		);
	}

	// We do some fancy hydration on certain types like Map and Set.
	// See also `freeze` in syncMain
	callback(JSON.parse(state, hydrate));
}

/**
 * This next bit is all just for being able to fill the store with the correct
 * state asynchronously, because blocking the thread feels bad for potentially
 * large stores.
 */
type InternalAction = ReturnType<typeof replaceState>;

const replaceState = <S>(state: S) => ({
	type: "mckayla.electron-redux.REPLACE_STATE" as const,
	payload: state,
	meta: { scope: "local" },
});

const wrapReducer = (reducer: Reducer) => <S, A extends Action>(
	state: S,
	action: InternalAction | A,
) => {
	switch (action.type) {
		case "mckayla.electron-redux.REPLACE_STATE":
			return (action as InternalAction).payload;
		default:
			return reducer(state, action);
	}
};

const middleware: Middleware = (store) => {
	ipcRenderer.on("mckayla.electron-redux.ACTION", (_, action: Action) => {
		store.dispatch(stopForwarding(action));
	});

	return (next) => (action) => {
		if (validateAction(action)) {
			ipcRenderer.send("mckayla.electron-redux.ACTION", action);
		}

		return next(action);
	};
};

export const syncRenderer: StoreEnhancer = (createStore: StoreCreator) => {
	preventDoubleInitialization();

	return (reducer, state) => {
		const store = createStore(
			wrapReducer(reducer),
			state,
			applyMiddleware(middleware),
		);

		// This is the reason we need to be an enhancer, rather than a middleware.
		// We use this (along with the wrapReducer function above) to dispatch an
		// action that initializes the store without needing to fetch it synchronously.
		getRendererState((state) => {
			store.dispatch(replaceState(state));
		});

		// XXX: TypeScript is dumb. If you return the call to createStore
		// immediately it's fine, but even assigning it to a constant and returning
		// will make it freak out. We fix this with the line below the return.
		return store;

		// XXX: Even though this is unreachable, it fixes the type signature????
		return (store as unknown) as any;
	};
};
