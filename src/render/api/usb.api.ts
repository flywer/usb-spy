import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";

export const get_usb_status = () => {
    return ipcInstance.send<string>(channels.usb.status)
}

export const disable_usb = () => {
    return ipcInstance.send<string>(channels.usb.disable)
}

export const enable_usb = () => {
    return ipcInstance.send<string>(channels.usb.enable)
}
