import {app} from 'electron'
import {createEinf} from 'einf'
import {AppController} from './controller/app.controller'
import {createWindow} from './main.window'
import {UsbController} from "@main/controller/usb.controller";
import {WpdController} from "@main/controller/wpd.controller";
import {ps} from "@main/powershell";
import ElectronLog from "electron-log";

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

async function electronAppInit() {
    const isDev = !app.isPackaged
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.exit()
            ps.dispose()
        }
    })

    if (isDev) {
        if (process.platform === 'win32') {
            process.on('message', (data) => {
                if (data === 'graceful-exit') {
                    app.exit()
                    ps.dispose()
                }
            })
        } else {
            process.on('SIGTERM', () => {
                app.exit()
                ps.dispose()
            })
        }
    }
}

async function bootstrap() {
    try {
        await electronAppInit()

        await createEinf({
            window: createWindow,
            controllers: [AppController, UsbController, WpdController],
            injects: [{
                name: 'IS_DEV',
                inject: !app.isPackaged,
            }],
        })

    } catch (error) {
        ElectronLog.error(error)
        app.quit()
    }
}

bootstrap()
