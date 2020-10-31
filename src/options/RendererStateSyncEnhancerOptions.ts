export type RendererStateSyncEnhancerOptions = {
    /**
     * Custom function used during de-serialization of the redux store to transform the object.
     * This function is called for each member of the object. If a member contains nested objects,
     * the nested objects are transformed before the parent object is.
     */
    reviver?: (this: unknown, key: string, value: unknown) => unknown

    /**
     * By default, renderer store is initialized from the main store in a synchronous way.
     * Since the synchronous fetching of the state is blocking the renderer process until it gets the state
     * from the main process, it might be better with huge stores to initialized them in an asynchronous matter,
     * by setting this flag to true
     */
    lazyInit?: boolean
}

export const defaultRendererOptions: RendererStateSyncEnhancerOptions = {}
