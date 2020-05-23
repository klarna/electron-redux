import { FluxStandardAction, isFSA } from "flux-standard-action";

type ActionMeta = {
	scope?: "local" | string;
};

const blacklist = [/^@@/, /^redux-form/];

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
