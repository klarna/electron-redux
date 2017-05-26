'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getInitialStateRenderer;

var _electron = require('electron');

var transit = require('transit-immutable-js');

function getInitialStateRenderer() {
  var guy = transit.fromJSON(_electron.remote.getGlobal('reduxState'));
  return transit.fromJSON(_electron.remote.getGlobal('reduxState'));
}