// We use this variable to store a stack trace of where the middleware
// is first initialized, to assist in debugging if someone accidentally enables
// it twice. This can easily be caused by importing files that are shared between
// the main and renderer processes.
let previouslyInitialized: Error

export const preventDoubleInitialization = () => {
    if (previouslyInitialized) {
        console.error(new Error('electron-redux has already been attached to a store'))
        console.error(previouslyInitialized)
    }

    // We are intentionally not actually throwing the error here, we just
    // want to capture the call stack.
    previouslyInitialized = new Error('Previously attached to a store')
}

/**
 * Removes the property prop from the given object. Think of it as an actual
 * runtime implementation of the TypeScript Omit<T, K> type.
 */
export const trimProperty = <T extends keyof X, X>(prop: T, obj: X) => {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => key !== prop)) as Omit<X, T>
}

/**
 * Removes multiple properties from the given object.
 */
export const trimProperties = <T extends keyof X, X>(props: T[], obj: X) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !props.includes(key as T))
    ) as Omit<X, T>
}
