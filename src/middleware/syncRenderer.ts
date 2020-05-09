import debug from "debug";
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

const log = debug("mckayla.electron-redux.sync");

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

export async function getRendererState(callback: (state) => void) {
	const state = await ipcRenderer.invoke(
		"mckayla.electron-redux.FETCH_STATE",
	);

	// TODO: I don't think this is the right error handling anymore
	if (typeof state !== "string") {
		throw new Error(
			"No Redux store found in main process. Did you apply the middleware?",
		);
	}

	// I just don't like the ().then() syntax
	// TODO: Copy and paste shrug emoji
	return callback(JSON.parse(state, hydrate));
}

const replaceState = <S>(state: S) => ({
	type: "mckayla.electron-redux.REPLACE_STATE" as const,
	payload: state,
	meta: { scope: "local" },
});

type InternalAction = ReturnType<typeof replaceState>;

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
			// TODO: We need a way to send actions from one renderer to another
			log("forwarding following action to main");
			ipcRenderer.send("mckayla.electron-redux.ACTION", action);
		}

		log("action:", action);
		return next(action);
	};
};

export const syncRenderer: StoreEnhancer = (createStore: StoreCreator) => {
	return (reducer, state) => {
		const store = createStore(
			wrapReducer(reducer),
			state,
			applyMiddleware(middleware),
		);

		// This is the reason we need to be an enhancer, rather than a middleware.
		// We use this (along with the wrapReducer function above) to dispatch an
		// action that initializes the store without needing to fetch it synchronously.

		// Also relevant, this is internally implemented using promises. It would be really
		// cool to use async/await syntax but we need to return a Store, not a Promise.
		getRendererState((state) => {
			store.dispatch(replaceState(state));
		});

		// TypeScript is fucking dumb. If you return the call to createStore
		// immediately it's fine, but even assigning it to a constant and returning
		// will make it freak out.
		return store;
		// Even though this line is unreachable, it fixes the type signature????
		// What the actual fuck TypeScript?
		return (store as unknown) as any;
	};
};
