'use strict';

var _alias = require('../alias');

jest.unmock('../alias');

describe('alias', function () {
  it('should return the ALIASED action type', function () {
    expect(_alias.ALIASED).toBe('ALIASED');
  });
});