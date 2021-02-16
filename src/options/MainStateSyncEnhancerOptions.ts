import { StateSyncOptions } from './StateSyncOptions'

export interface MainStateSyncEnhancerOptions extends StateSyncOptions {
    /**
     * Custom store serialization function.
     * This function is called for each member of the object. If a member contains nested objects,
     * the nested objects are transformed before the parent object is.
     */
    serializer?: (this: unknown, key: string, value: unknown) => unknown
}
