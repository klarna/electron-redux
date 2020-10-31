import { isFSA, FluxStandardAction } from './isFSA'

// Certain actions that we should never replay across stores
const blacklist = [/^@@/, /^redux-form/]

// Gives us just enough action type info to work for the functions below
export type ActionMeta = {
    scope?: 'local' | string
}

/**
 * stopForwarding allows you to give it an action, and it will return an
 * equivalent action that will only play in the current process
 */
export const stopForwarding = (action: FluxStandardAction<ActionMeta>) => ({
    ...action,
    meta: {
        ...action.meta,
        scope: 'local',
    },
})

/**
 * validateAction ensures that the action meets the right format and isn't scoped locally
 */
export const validateAction = (action: any): action is FluxStandardAction<ActionMeta> => {
    return (
        isFSA(action) &&
        action.meta?.scope !== 'local' &&
        blacklist.every((rule) => !rule.test(action.type))
    )
}
