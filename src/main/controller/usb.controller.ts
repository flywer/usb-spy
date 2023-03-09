import {Controller, IpcHandle, IpcSend} from "einf";
import {UsbService} from "@main/service/usb.service";
import {channels} from "@render/api/channels";
import {ADMIN_START, ps} from "@main/powershell";
import ElectronLog from "electron-log";

@Controller()
export class UsbController {
    constructor(
        private deviceControlService: UsbService,
    ) {
    }

    @IpcHandle(channels.usb.status)
    public async replyMsg() {
        if (await this.deviceControlService.getUsbStorageStatus()) {
            return '当前USB移动存储设备可使用'
        } else {
            return '当前USB移动存储设备不可使用'
        }
    }

    @IpcHandle(channels.usb.enable)
    public async enableUsb() {
        return await this.deviceControlService.enableUsb()
    }

    @IpcHandle(channels.usb.disable)
    public async disableUsb() {
        return await this.deviceControlService.disableUsb()
    }

    @IpcSend(channels.usb.eject)
    public async eject(deviceId: string) {
        return await this.deviceControlService.eject(deviceId)
    }

    @IpcHandle(channels.usb.logical)
    public async getLogicalLetter(deviceId: string) {
        deviceId= 'USB\\VID_346D&PID_5678\\3327691123111680644';
        return await this.deviceControlService.getLogicalLetter(deviceId)
    }
}
