import {Injectable} from 'einf'
import ElectronLog from "electron-log";
import {registryTxtToJson} from "@main/string.utils";
import {ADMIN_START, ps} from "@main/powershell";
import {isEqual} from "lodash";

@Injectable()
export class UsbService {
    private readonly USB_STOR = ' \'HKLM:\\SYSTEM\\CurrentControlSet\\services\\USBSTOR\' '

    /**
     * 获取USB移动存储设备状态
     */
    public async getUsbStorageStatus(): Promise<boolean> {
        let res;

        ps.addCommand(`Get-ItemProperty ${this.USB_STOR} -name start`);
        await ps.invoke()
            .then(output => {
                res = isEqual(registryTxtToJson(output).Start, '3');
            })
            .catch(err => {
                ElectronLog.error(err);
            });
        return res;
    }

    public async enableUsb() {
        let res = '启用失败';

        ps.addCommand(`${ADMIN_START} "Set-ItemProperty ${this.USB_STOR} -name start -Value 3" `);
        await ps.invoke()
            .then(() => {
                res = '启用成功';
            })
            .catch(err => {
                ElectronLog.error(err)
            })

        return res;
    }

    public async disableUsb() {
        let res = '禁用失败';

        ps.addCommand(`${ADMIN_START} "Set-ItemProperty ${this.USB_STOR} -name start -Value 4" `);
        await ps.invoke()
            .then(() => {
                res = '禁用成功';
            })
            .catch(err => {
                ElectronLog.error(err)
            })

        return res;
    }

    async eject(deviceId) {
        let res: any = {};

        //ps.addCommand(`${ADMIN_START} " pnputil.exe /disable-device ${deviceId}" `)
        ps.addCommand(`${ADMIN_START} " pnputil.exe /remove-device \'${deviceId}\' " `)
        await ps.invoke()
            .then(() => {
                res['result'] = '设备弹出成功'
            })
            .catch(err => {
                ElectronLog.error(err)
                res['result'] = '设备弹出失败'
            })

        return res;
    }

    /**
     * @description: 获取设备盘符，即逻辑驱动器名
     * @author: wangcb
     * @date: 2023/3/8 16:11
     **/
    async getLogicalLetter(deviceId) {

    }
}
