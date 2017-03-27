'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAliasedAction;

var _alias = require('../actions/alias');

var _alias2 = require('../registry/alias');

var _alias3 = _interopRequireDefault(_alias2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createAliasedAction(name, actionCreator) {
  // register
  _alias3.default.set(name, actionCreator);

  // factory
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return {
      type: _alias.ALIASED,
      payload: args,
      meta: {
        trigger: name
      }
    };
  };
}