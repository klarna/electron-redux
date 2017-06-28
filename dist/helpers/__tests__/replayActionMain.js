'use strict';

var _electron = require('electron');

var _replayActionMain = require('../replayActionMain');

var _replayActionMain2 = _interopRequireDefault(_replayActionMain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.unmock('../replayActionMain');

describe('replayActionMain', function () {
    it('should replay any actions received', function () {
        var store = {
            dispatch: jest.fn(),
            getState: jest.fn(),
            subscribe: jest.fn()
        };
        var payload = 123;

        (0, _replayActionMain2.default)(store);

        expect(_electron.ipcMain.on).toHaveBeenCalledTimes(1);
        expect(_electron.ipcMain.on.mock.calls[0][0]).toBe('redux-action');
        expect(_electron.ipcMain.on.mock.calls[0][1]).toBeInstanceOf(Function);

        var cb = _electron.ipcMain.on.mock.calls[0][1];
        cb('someEvent', payload);

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith(payload);
    });

    it('should subscribe to the store and update the global state', function () {
        var initialState = { initial: 'state' };
        var newState = { new: 'state' };
        var store = {
            dispatch: jest.fn(),
            getState: jest.fn(function () {
                return initialState;
            }),
            subscribe: jest.fn()
        };

        (0, _replayActionMain2.default)(store);

        expect(global.reduxState).toEqual(initialState);
        expect(store.subscribe).toHaveBeenCalledTimes(1);
        expect(store.subscribe.mock.calls[0][0]).toBeInstanceOf(Function);

        var subscribeCb = store.subscribe.mock.calls[0][0];
        store.getState = jest.fn(function () {
            return newState;
        });
        subscribeCb();

        expect(global.reduxState).toEqual(newState);
    });
});