"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jest.fn();
var BrowserWindow = exports.BrowserWindow = {
  getAllWindows: jest.fn(function () {
    return [];
  })
};

var ipcMain = exports.ipcMain = {
  on: jest.fn()
};

var ipcRenderer = exports.ipcRenderer = {
  on: jest.fn(),
  send: jest.fn()
};

var remote = exports.remote = {
  getGlobal: jest.fn()
};