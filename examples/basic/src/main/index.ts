import url from 'url'
import { app, BrowserWindow } from 'electron'
import { stateSyncEnhancer } from 'electron-redux/main'
import { createStore } from 'redux'
import { rootReducer } from '../store'

const TESTING = process.env.SPECTRON === 'true'
// ==================================================================
// electron related boiler-plate to create window with singe renderer
let mainWindow: BrowserWindow | null
async function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: `${__dirname}/preload.js`,
            // PROD app should be running with contextIsolation: true for security reasons. Disabled only while running e2e tests
            contextIsolation: !TESTING,
            // ONLY TRUE FOR TESTING - SPECTRON needs node integration to be able to access the remote modules.
            nodeIntegration: TESTING,
        },
    })
    await mainWindow.loadURL(
        url.format({
            pathname: `${__dirname}/index.html`,
            protocol: 'file',
            slashes: true,
        })
    )

    render()

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// Boilerplate code ends here
// ==================================================================
// And here is electron-redux example usage

// This will create the new Redux Store for main process - as third argument (or 2nd, if you would not pass initial state)
// we have passed the store enhancer responsible for the synchronization

const initialState = {
    globalCounter: 1,
    localCounter: 1,
}

const store = createStore(rootReducer, initialState, stateSyncEnhancer())

const render = () => {
    if (mainWindow) {
        const { globalCounter, localCounter } = store.getState()
        mainWindow.setTitle(`Global counter: [${globalCounter}] | Local counter: [${localCounter}]`)
    }
}

store.subscribe(render)
