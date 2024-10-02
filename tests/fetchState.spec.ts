import { fetchInitialStateAsync } from '../src/renderer/fetchInitialStateAsync'
import { fetchInitialState } from '../src/renderer/fetchInitialState'

import { IPCEvents } from '../src/constants'
jest.mock('electron', () => ({
    ipcRenderer: {
        sendSync: jest.fn(),
        invoke: jest.fn(),
    },
}))
import { ipcRenderer } from 'electron'

describe('Store synchronization', () => {
    describe('using synchronous method', () => {
        it('should receive and deserialize simple state', () => {
            const ipcSpy = jest.spyOn(ipcRenderer, 'sendSync').mockReturnValue('{ "count": 1 }')
            const state = fetchInitialState({})
            expect(ipcSpy).toHaveBeenCalledTimes(1)
            expect(ipcSpy).toHaveBeenCalledWith(IPCEvents.INIT_STATE)
            expect(state).toEqual({ count: 1 })
        })
    })
    describe('using asynchronous method', () => {
        it('should receive and deserialize simple state', (done) => {
            const ipcSpy = jest.spyOn(ipcRenderer, 'invoke').mockResolvedValue('{ "count": 1 }')
            fetchInitialStateAsync({}, (state) => {
                expect(ipcSpy).toHaveBeenCalledTimes(1)
                expect(ipcSpy).toHaveBeenCalledWith(IPCEvents.INIT_STATE_ASYNC)
                expect(state).toEqual({ count: 1 })
                done()
            })
        })
    })
})
