export type MainStateSyncEnhancerOptions = {
    /**
     * Custom store serializaton function. This function is called for each member of the object.
     * If a member contains nested objects,
     * the nested objects are transformed before the parent object is.
     */
    replacer?: (this: unknown, key: string, value: unknown) => unknown
}

export const defaultMainOptions: MainStateSyncEnhancerOptions = {}
