const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');
const { createStore, applyMiddleware } = require('redux');
const {
  forwardToRenderer,
  triggerAlias,
  replayActionMain,
  createAliasedAction,
} = require('electron-redux');
const reducers = require('../reducers');

const isDevelopment = process.env.NODE_ENV !== 'production';

const store = createStore(reducers, 0, applyMiddleware(triggerAlias, forwardToRenderer));

replayActionMain(store);

// having to do this currently because of https://github.com/klarna/electron-redux/issues/58
createAliasedAction('INCREMENT_ALIASED', () => ({ type: 'INCREMENT' }));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  if (isDevelopment) {
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, '../renderer/index.html'),
        protocol: 'file',
        slashes: true,
      }),
    );
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
