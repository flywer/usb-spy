import {join} from 'path'
import {BrowserWindow, app} from 'electron'
import {ps} from "@main/powershell";
import {usbDetectInit} from "@main/usb.detect";

const isDev = !app.isPackaged

export async function createWindow() {
    const win = new BrowserWindow({
        width: 850,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, '../preload/index.js'),
            devTools: isDev,
        },
        autoHideMenuBar: true,//!isDev
    })

    //win.maximize()

    const URL = isDev
        ? process.env.DS_RENDERER_URL
        : `file://${join(app.getAppPath(), 'dist/render/index.html')}`

    win.loadURL(URL).then(() => {
        usbDetectInit(win)
    })

    if (isDev) {
        // win.webContents.openDevTools()
    } else
        win.removeMenu()

    win.on('closed', () => {
        win.destroy()
        ps.dispose()
    })

    return win
}

export async function restoreOrCreateWindow() {
    let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())

    if (window === undefined)
        window = await createWindow()

    if (window.isMinimized())
        window.restore()

    window.focus()
}
