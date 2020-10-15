/**
 * Preserves some types like Map and Set when serializing
 */
export const freeze = (_: string, value: unknown): unknown => {
    if (value instanceof Map) {
        const obj = Object.fromEntries(value)
        obj.__hydrate_type = '__hydrate_map'
        return obj
    } else if (value instanceof Set) {
        return {
            __hydrate_type: '__hydrate_set',
            items: Array.from(value),
        }
    }

    return value
}

/**
 * Hydrates some types like Map and Set when deserializing
 */
export const hydrate = (_: string, value: any) => {
    if (value?.__hydrate_type === '__hydrate_map') {
        return new Map(Object.entries(value).filter(([key]) => key !== '__hydrate_type'))
    } else if (value?.__hydrate_type === '__hydrate_set') {
        return new Set(value.items)
    }

    return value
}
