import {Registry} from "winreg-ts";

export const USB_STOR_KEY = new Registry({
    hive: Registry.HKLM,
    key: '\\SYSTEM\\CurrentControlSet\\services\\USBSTOR',
    utf8: true
});
