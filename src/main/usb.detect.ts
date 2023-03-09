import {decimalToHexadecimal} from "@main/utils/number.utils";

export let usbDeviceList: any = {};
export const usbDetect = require('usb-detection');

export const usbDetectInit = (win) => {
    usbDetect.startMonitoring();

    const si = require("systeminformation")

    usbDetect.on('add', (device) => {
        //设备唯一实例ID
        device['deviceId'] = `USB\\VID_${decimalToHexadecimal(device.vendorId)}&PID_${decimalToHexadecimal(device.productId)}\\${device.serialNumber}`

        // usbDeviceList.push(device)

        win.webContents.send('usb-add', device)
        //si.usb().then(data => ElectronLog.info(data));
    });
    usbDetect.on('remove', (device) => {
        win.webContents.send('usb-remove', device)
        //  si.usb().then(data => ElectronLog.info(data));
    });
}
