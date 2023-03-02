import {ipcInstance} from '@render/plugins'

export function sendMsgToMainProcess(msg: string) {
    return ipcInstance.send<string>('send-msg', msg)
}

export function disableUsb() {
    return ipcInstance.send<string>('disableUsb')
}

export function getUsbInfo1() {
    return ipcInstance.send<string>('getUsbInfo')
}

export function enableUsb() {
    return ipcInstance.send<string>('enableUsb')
}
