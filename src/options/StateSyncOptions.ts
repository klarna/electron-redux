export interface StateSyncOptions {
    /**
     * Custom list for actions that should never replay across stores
     */
    denyList?: RegExp[]

    /**
     * Prevent replaying actions in the current process
     */
    preventActionReplay?: boolean
}
