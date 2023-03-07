import {Injectable} from "einf";
import {ps} from "@main/powershell";
import ElectronLog from "electron-log";
import {isEqual} from 'lodash'
import {registryTxtToJson, removeLineBreaks} from "@main/stringUtils";

@Injectable()
export class WpdService {

    private readonly POLICY_PATH = '\'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\''
    private readonly POLICY_SETUP_PATH = '\'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\\{6AC27878-A6FA-4155-BA85-F98F491D4F33}\''

    /**
     * @description: 获取WPD设备策略
     * @author: wangcb
     * @date: 2023/3/7 16:00
     **/
    public async wpdPolicySetup() {
        let res: any = {};

        ps.addCommand('Start-Process powershell -Verb RunAs -WindowStyle Hidden');
        ps.addCommand(`Test-Path ${this.POLICY_PATH}`)

        await ps.invoke()
            .then(async output => {
                if (isEqual(removeLineBreaks(output), 'True')) {
                    //应用层WPD设备禁用以及只读策略
                    ps.addCommand(`Test-Path ${this.POLICY_SETUP_PATH}`)
                    await ps.invoke()
                        .then(async output => {
                                if (isEqual(removeLineBreaks(output), 'True')) {
                                    ps.addCommand(`Get-ItemProperty ${this.POLICY_SETUP_PATH}`)
                                    await ps.invoke()
                                        .then(output => {
                                            let json = registryTxtToJson(output);
                                            res['denyRead'] = json.Deny_Read
                                            res['denyWrite'] = json.Deny_Write
                                        }).catch(err => {
                                            ElectronLog.error(err);
                                        })
                                } else {
                                    ps.addCommand(`New-Item -Path ${this.POLICY_SETUP_PATH}`)
                                }
                            }
                        )
                        .catch(err => {
                            ElectronLog.error(err);
                        })
                } else {
                    ps.addCommand(`New-Item -Path ${this.POLICY_PATH}`)
                }
            }).catch(err => {
                ElectronLog.error(err);
            })

        return res;
    }

    public async stopWpdService() {
        try {

            // 加载DeviceManagement模块和获取wpd服务信息
            await ps.addCommand('Import-Module -Name "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\DeviceManagement\\DeviceManagement.psd1"');
            await ps.addCommand('$service = Get-Service -Name "WpdBusEnum"');

            // 停止wpd服务
            const stopCmd = '$service.Stop()';
            await ps.addCommand(stopCmd);
            await ps.invoke();
            await ps.dispose();

            console.log('已停止 WpdBusEnum 服务');
            return '已停止 WpdBusEnum 服务'
        } catch (err) {
            console.error(`出现错误：${err}`);
            return `出现错误：${err}`
        }
    }

    public async startWpdService() {
        try {

            // 加载DeviceManagement模块和获取wpd服务信息
            await ps.addCommand('Import-Module -Name "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules\\DeviceManagement\\DeviceManagement.psd1"');
            await ps.addCommand('$service = Get-Service -Name "WpdBusEnum"');

            // 启动wpd服务
            const startCmd = '$service.Start()';
            await ps.addCommand(startCmd);
            await ps.invoke();
            await ps.dispose();

            console.log('已启动 WpdBusEnum 服务');
            return '已启动 WpdBusEnum 服务'
        } catch (err) {
            console.error(`出现错误：${err}`);
            return `出现错误：${err}`
        }
    }
}
