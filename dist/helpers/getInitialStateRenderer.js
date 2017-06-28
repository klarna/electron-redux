'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getInitialStateRenderer;

var _electron = require('electron');

function getInitialStateRenderer() {
  return JSON.parse(_electron.remote.getGlobal('reduxStateStringified'));
}