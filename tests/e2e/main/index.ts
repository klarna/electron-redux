import path from 'path'
import url from 'url'
import { app, BrowserWindow, ipcMain } from 'electron'
import { applyMiddleware, compose, createStore } from 'redux'
import { reducer } from '../../counter'
import { mainStateSyncEnhancer } from '../../..'
import { countMiddleware } from '../../middleware'

const isDevelopment = process.env.NODE_ENV !== 'production'

const defaultState = {
    count: 10,
}

const middleware = applyMiddleware(countMiddleware)
const enhancer = compose(middleware, mainStateSyncEnhancer())
const store = createStore(reducer, defaultState, enhancer)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    })

    if (isDevelopment) {
        mainWindow.webContents.openDevTools()
    }

    if (isDevelopment) {
        mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    } else {
        mainWindow.loadURL(
            url.format({
                pathname: path.join(__dirname, '../renderer/index.html'),
                protocol: 'file',
                slashes: true,
            })
        )
    }
    renderValue()

    ipcMain.once('mainsetCountMiddleware', () => {
        store.dispatch({ type: 'SET_COUNT_MIDDLEWARE', payload: 9 })
    })

    ipcMain.once('mainIncrement', () => {
        store.dispatch({ type: 'INCREMENT' })
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

function renderValue() {
    if (mainWindow) {
        mainWindow.setTitle(store.getState().count.toString())
    }
}

store.subscribe(renderValue)
