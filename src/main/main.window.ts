import {join} from 'path'
import {BrowserWindow, app} from 'electron'
import ElectronLog, {log} from "electron-log";
import usbDetect from "usb-detection";
import si from "systeminformation";
import {trim} from "lodash-es";
import {stringToMapByKey} from "@main/stringUtils";
import parseJson from 'parse-json';

const isDev = !app.isPackaged

export async function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, '../preload/index.js'),
            devTools: isDev,
        },
        autoHideMenuBar: !isDev,
    })

    //win.maximize()

    const URL = isDev
        ? process.env.DS_RENDERER_URL
        : `file://${join(app.getAppPath(), 'dist/render/index.html')}`

    win.loadURL(URL).then(() => {
        const usbDetect = require('usb-detection');

        usbDetect.startMonitoring();

        const si = require("systeminformation")
        usbDetect.on('add', function (device) {
            ElectronLog.info('add', device);
            win.webContents.send('usb-add',device)
            //si.usb().then(data => ElectronLog.info(data));
        });
        usbDetect.on('remove', function (device) {
            ElectronLog.info('remove', device);
            win.webContents.send('usb-remove',device)
            //si.usb().then(data => ElectronLog.info(data));
        });
    })

    if (isDev)
        win.webContents.openDevTools()

    else
        win.removeMenu()

    win.on('closed', () => {
        win.destroy()
    })

    return win
}

const spy = () => {

}

export async function restoreOrCreateWindow() {
    let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed())

    if (window === undefined)
        window = await createWindow()

    if (window.isMinimized())
        window.restore()

    window.focus()
}
