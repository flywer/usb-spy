import {Controller, IpcHandle} from "einf";
import {UsbService} from "@main/service/usb.service";
import {channels} from "@render/api/channels";

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
}
