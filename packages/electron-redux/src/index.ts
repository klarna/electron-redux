// export {
// 	forwardToMain,
// 	forwardToMainWithParams,
// } from "./middleware/forwardToMain";
// export { forwardToRenderer } from "./middleware/forwardToRenderer";
// export { triggerAlias } from "./middleware/triggerAlias";
// export { createAliasedAction } from "./helpers/createAliasedAction";
// export { replayActionMain } from "./helpers/replayActionMain";
// export { replayActionRenderer } from "./helpers/replayActionRenderer";
// export { getInitialStateRenderer } from "./helpers/getInitialStateRenderer";

export * from "./helpers/getRendererState";
export * from "./middleware/useMain";
export * from "./middleware/useRenderer";

// export const getRendererState = () => ({});
// export const useMain = () => (next: (action: any) => void) => (action: any) =>
// 	next(action);
// export const useRenderer = () => (next: (action: any) => void) => (
// 	action: any,
// ) => next(action);
