"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var aliases = {};

exports.default = {
  get: function get(key) {
    return aliases[key];
  },

  set: function set(key, value) {
    aliases[key] = value;
  }
};