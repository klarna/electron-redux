import { FluxStandardAction, isFSA } from "flux-standard-action";

// Certain actions that we should never replay across stores
const blacklist = [/^@@/, /^redux-form/];

/**
 * Preserves some types like Map and Set when serializing
 */
export const freeze = (_: string, value: unknown): unknown => {
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

/**
 * Hydrates some types like Map and Set when deserializing
 */
export const hydrate = (_: string, value: any) => {
	if (value?.__hydrate_type === "__hydrate_map") {
		return new Map(
			Object.entries(value).filter(([key]) => key !== "__hydrate_type"),
		);
	} else if (value?.__hydrate_type === "__hydrate_set") {
		return new Set(value.items);
	}

	return value;
};

// We use this variable to store a stack trace of where the middleware
// is first initialized, to assist in debugging if someone accidentally enables
// it twice. This can easily be caused by importing files that are shared between
// the main and renderer processes.
let previouslyInitialzed: Error;

export const preventDoubleInitialization = () => {
	if (previouslyInitialzed) {
		console.error(
			new Error("electron-redux has already been attached to a store"),
		);
		console.error(previouslyInitialzed);
	}

	// We are intentionally not actually throwing the error here, we just
	// want to capture the call stack for debugging.
	previouslyInitialzed = new Error("Previously attached to a store at");
};

// Gives us just enough action type info to work for the functions below
type ActionMeta = {
	scope?: "local" | string;
};

/**
 * stopForwarding allows you to give it an action, and it will return an
 * equivalent action that will only play in the current process
 */
export const stopForwarding = (
	action: FluxStandardAction<string, unknown, ActionMeta>,
) => ({
	...action,
	meta: {
		...action.meta,
		scope: "local",
	},
});

/**
 * validateAction ensures that the action meets the right format and isn't scoped locally
 */
export const validateAction = (
	action: unknown,
): action is FluxStandardAction<string, unknown, ActionMeta> => {
	return (
		isFSA<string, unknown, ActionMeta>(action) &&
		action.meta?.scope !== "local" &&
		blacklist.every((rule) => !rule.test(action.type))
	);
};
