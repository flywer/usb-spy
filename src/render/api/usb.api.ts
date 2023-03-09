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

export const eject = (deviceId: string) => {
    return ipcInstance.send<string>(channels.usb.eject, deviceId)
}

export const get_logical_letter = (deviceId: string) => {
    return ipcInstance.send<string>(channels.usb.logical, deviceId)
}
