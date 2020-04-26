import debug from "debug";
import { FluxStandardAction, isFSA } from "flux-standard-action";

const log = debug("mckayla.electron-redux.validateAction");

export function validateAction<P, M>(
	action: unknown,
): action is FluxStandardAction<P, M> {
	if (!isFSA(action)) {
		log("WARNING! Action not FSA-compliant", action);
		return false;
	}

	return true;
}
