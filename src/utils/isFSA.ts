import isPlainObject from 'lodash.isplainobject'
import isString from 'lodash.isstring'

export const isFSA = (action: FluxStandardAction): boolean =>
    isPlainObject(action) && isString(action.type) && Object.keys(action).every(isValidKey)

const isValidKey = (key: string) => ['type', 'payload', 'error', 'meta'].indexOf(key) > -1

export type FluxStandardAction<Meta = unknown> = {
    type: string
    payload?: unknown
    meta?: Meta
}
