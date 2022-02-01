import { Middleware } from 'redux'

export const countMiddleware: Middleware = () => (next) => (action) => {
    return next({
        ...action,
        payload: 99,
    })
}
