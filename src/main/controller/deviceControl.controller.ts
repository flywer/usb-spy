import {Controller, IpcHandle, IpcSend} from "einf";
import {DeviceControlService} from "@main/service/deviceControl.service";
import usbDetect from "usb-detection";
import ElectronLog from "electron-log";
import si from "systeminformation";

@Controller()
export class DeviceControlController {
    constructor(
        private deviceControlService: DeviceControlService,
    ) {
    }

    @IpcHandle('getUsbInfo')
    public async replyMsg() {
        if (await this.deviceControlService.getUsbStorageStatus()) {
            return '当前USB移动存储设备可使用'
        } else {
            return '当前USB移动存储设备不可使用'
        }
    }

    @IpcHandle('enableUsb')
    public async enableUsb() {
        return await this.deviceControlService.enableUsb()
    }

    @IpcHandle('disableUsb')
    public async disableUsb() {
        return await this.deviceControlService.disableUsb()
    }
}
