import {Injectable} from 'einf'
import ElectronLog from "electron-log";
import {stringToMapByKey} from "@main/stringUtils";
import {ps} from "@main/powershell";

@Injectable()
export class DeviceControlService {

    /**
     * 获取USB移动存储设备状态
     */
    public async getUsbStorageStatus(): Promise<boolean> {

        ps.addCommand('Get-ItemProperty "HKLM:\\SYSTEM\\CurrentControlSet\\services\\USBSTOR" -name start');

        let res;

        await ps.invoke()
            .then(output => {
                let maps = stringToMapByKey(output, ':')

                maps.forEach(map => {
                    if (map.key === 'Start') {
                        res = map.value === '3';
                    }
                })
            })
            .catch(err => {
                ElectronLog.error(err);
            });
        return res;
    }

    public async enableUsb() {
        let res = '启用失败';

        ps.addCommand('Start-Process powershell -ArgumentList "Set-ItemProperty \'HKLM:\\SYSTEM\\CurrentControlSet\\services\\USBSTOR\' -name start -Value 3" -Verb RunAs');
        await ps.invoke()
            .then((output) => {
                ElectronLog.info('output', output)
                res = '启用成功';
            })
            .catch(err => {
                ElectronLog.error(err)
            })

        return res;
    }

    public async disableUsb() {
        let res = '禁用失败';

        ps.addCommand('Start-Process powershell -ArgumentList "Set-ItemProperty \'HKLM:\\SYSTEM\\CurrentControlSet\\services\\USBSTOR\' -name start -Value 4" -Verb RunAs');
        await ps.invoke()
            .then((output) => {
                ElectronLog.info('output', output)
                res = '禁用成功';
            })
            .catch(err => {
                ElectronLog.error(err)
            })

        return res;
    }

}
