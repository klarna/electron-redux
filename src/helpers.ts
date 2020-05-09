import debug from "debug";
import { FluxStandardAction, isFSA } from "flux-standard-action";

type ActionMeta = {
	scope?: "local" | string;
};

const log = debug("mckayla.electron-redux.validation");

const blacklist = [/^@@/, /^redux-form/];

export const stopForwarding = (
	action: FluxStandardAction<string, unknown, ActionMeta>,
) => ({
	...action,
	meta: {
		...action.meta,
		scope: "local",
	},
});

export const validateAction = (
	action: unknown,
): action is FluxStandardAction<string, unknown, ActionMeta> => {
	isFSA;
	if (!isFSA<string, unknown, ActionMeta>(action)) {
		log("Only flux-standard-actions will be forwarded", action);
		return false;
	}

	if (
		action.meta?.scope === "local" ||
		blacklist.some((rule) => rule.test(action.type))
	)
		return false;

	return true;
};
