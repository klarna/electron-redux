'use strict';

var _alias = require('../alias');

var _alias2 = _interopRequireDefault(_alias);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.unmock('../alias');

describe('alias', function () {
  describe('#set', function () {
    it('should set a value', function () {
      expect(function () {
        _alias2.default.set('abc', 123);
      }).not.toThrow();
    });
  });

  describe('#get', function () {
    it('should get a value', function () {
      _alias2.default.set('abc', 123);
      expect(_alias2.default.get('abc')).toEqual(123);
    });
  });
});