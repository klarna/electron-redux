'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _alias = require('../actions/alias');

var _alias2 = require('../registry/alias');

var _alias3 = _interopRequireDefault(_alias2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */


var triggerAlias = function triggerAlias(store) {
  return function (next) {
    return function (action) {
      // TODO: store.dispatch() instead to not skip any middleware
      if (action.type === _alias.ALIASED) {
        (0, _assert2.default)(action.meta && action.meta.trigger, 'No trigger defined');
        var alias = _alias3.default.get(action.meta.trigger);
        (0, _assert2.default)(alias, 'Trigger alias ' + action.meta.trigger + ' not found');
        var args = action.payload || [];

        // trigger alias
        action = alias.apply(undefined, _toConsumableArray(args));
      }

      return next(action);
    };
  };
};

exports.default = triggerAlias;