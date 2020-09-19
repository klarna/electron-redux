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
	hydrate,
	preventDoubleInitialization,
	stopForwarding,
	validateAction,
} from "./utils";

async function getRendererState(callback: (state: unknown) => void) {
	// Electron will throw an error if there isn't a handler for the channel.
	// We catch it so that we can throw a more useful error
	const state = await ipcRenderer
		.invoke("electron-redux.FETCH_STATE")
		.catch((error) => {
			console.error(error);
			throw new Error(
				"No Redux store found in main process. Did you use the syncMain enhancer?",
			);
		});

	// We do some fancy hydration on certain types like Map and Set.
	// See also `freeze`
	callback(JSON.parse(state, hydrate));
}

/**
 * This next bit is all just for being able to fill the store with the correct
 * state asynchronously, because blocking the thread feels bad for potentially
 * large stores.
 */
type InternalAction = ReturnType<typeof replaceState>;

/**
 * Creates an action that will replace the current state with the provided
 * state. The scope is set to local in this creator function to make sure it is
 * never forwarded.
 */
const replaceState = <S>(state: S) => ({
	type: "electron-redux.REPLACE_STATE" as const,
	payload: state,
	meta: { scope: "local" },
});

const wrapReducer = (reducer: Reducer) => <S, A extends Action>(
	state: S,
	action: InternalAction | A,
) => {
	switch (action.type) {
		case "electron-redux.REPLACE_STATE":
			return (action as InternalAction).payload;
		default:
			return reducer(state, action);
	}
};

const middleware: Middleware = (store) => {
	// When receiving an action from main
	ipcRenderer.on("electron-redux.ACTION", (_, action: Action) => {
		store.dispatch(stopForwarding(action));
	});

	return (next) => (action) => {
		if (validateAction(action)) {
			ipcRenderer.send("electron-redux.ACTION", action);
		}

		return next(action);
	};
};

export const syncRenderer: StoreEnhancer = (createStore: StoreCreator) => {
	preventDoubleInitialization();

	return (reducer, state) => {
		const store = createStore(
			wrapReducer(reducer as any), // TODO: this needs some ❤️
			state,
			applyMiddleware(middleware),
		);

		// This is the reason we need to be an enhancer, rather than a middleware.
		// We use this (along with the wrapReducer function above) to dispatch an
		// action that initializes the store without needing to fetch it synchronously.
		getRendererState((state) => {
			store.dispatch(replaceState(state));
		});

		// TODO: this needs some ❤️
		// XXX: TypeScript is dumb. If you return the call to createStore
		// immediately it's fine, but even assigning it to a constant and returning
		// will make it freak out. We fix this with the line below the return.
		return store;

		// TODO: this needs some ❤️
		// XXX: Even though this is unreachable, it fixes the type signature????
		return (store as unknown) as any;
	};
};
