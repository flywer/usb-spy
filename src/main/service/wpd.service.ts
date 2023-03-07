import {Injectable} from "einf";
import {ps} from "@main/powershell";
import ElectronLog from "electron-log";
import {isEqual} from 'lodash'
import {registryTxtToJson, removeLineBreaks} from "@main/stringUtils";

@Injectable()
export class WpdService {

    /*策略根路径*/
    private readonly POLICY_PATH = ' \'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\' '

    /*策略配置路径*/
    private readonly POLICY_SETUP_PATH = ' \'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\\{6AC27878-A6FA-4155-BA85-F98F491D4F33}\' '

    /*策略启用路径*/
    private readonly ENABLE_POLICY_PATH = ' \'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\\{F33FDC04-D1AC-4E8E-9A30-19BBD4B108AE}\' '

    /**
     * @description: 判断WPD设备策略路径是否存在
     * @author: wangcb
     * @date: 2023/3/7 17:34
     **/
    public async checkWpdPolicyPath() {
        let policyPath = false
        let enablePolicyPath = false
        ps.addCommand(`Test-Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\\{6AC27878-A6FA-4155-BA85-F98F491D4F33}' `)
        await ps.invoke()
            .then(async output => {
                policyPath = isEqual(removeLineBreaks(output), 'True');
            })
            .catch(err => {
                ElectronLog.error(err);
            })

        ps.addCommand(`Test-Path 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\RemovableStorageDevices\\{F33FDC04-D1AC-4E8E-9A30-19BBD4B108AE}' `)
        await ps.invoke()
            .then(async output => {
                enablePolicyPath = isEqual(removeLineBreaks(output), 'True');
            })
            .catch(err => {
                ElectronLog.error(err);
            })
        return {policyPath, enablePolicyPath};
    }

    /**
     * @description: 若无路径，则创建路径，并赋初值
     * @author: wangcb
     * @date: 2023/3/7 18:04
     **/
    public async createWpdPolicyPath(policyPath: boolean, enablePolicyPath: boolean) {
        if (!policyPath) {
            ps.addCommand(`Start-Process powershell -Verb RunAs -WindowStyle Hidden -ArgumentList "New-Item -ItemType Directory ${this.POLICY_SETUP_PATH}" `)
            ps.addCommand(`Start-Process powershell -Verb RunAs -WindowStyle Hidden -ArgumentList "New-ItemProperty -Path ${this.POLICY_SETUP_PATH} -Name \'Deny_Read\' -Value 1 -PropertyType DWORD" `)
            ps.addCommand(`Start-Process powershell -Verb RunAs -WindowStyle Hidden -ArgumentList "New-ItemProperty -Path ${this.POLICY_SETUP_PATH} -Name \'Deny_Write\' -Value 1 -PropertyType DWORD" `)
        }
        if (!enablePolicyPath) {
            ps.addCommand(`Start-Process powershell -Verb RunAs -WindowStyle Hidden -ArgumentList "New-Item -ItemType Directory ${this.ENABLE_POLICY_PATH}" `)
            ps.addCommand(`Start-Process powershell -Verb RunAs -WindowStyle Hidden -ArgumentList "New-ItemProperty -Path ${this.ENABLE_POLICY_PATH} -Name \'Deny_Read\' -Value 0 -PropertyType DWORD" `)
            ps.addCommand(`Start-Process powershell -Verb RunAs -WindowStyle Hidden -ArgumentList "New-ItemProperty -Path ${this.ENABLE_POLICY_PATH} -Name \'Deny_Write\' -Value 0 -PropertyType DWORD" `)
        }
        await ps.invoke()
            .catch(err => {
                ElectronLog.error(err);
            })
        return 'WPD设备策略路径创建完毕'
    }

    /**
     * @description: 获取WPD设备读写策略
     * @author: wangcb
     * @date: 2023/3/7 16:00
     **/
    public async wpdPolicySetup() {
        let res: any = {};

        //ps.addCommand('Start-Process powershell -Verb RunAs -WindowStyle Hidden');
        ps.addCommand(`Test-Path ${this.POLICY_PATH}`)

        await ps.invoke()
            .then(async output => {
                //若没有此项则新增
                if (!isEqual(removeLineBreaks(output), 'True')) {
                    ps.addCommand(`New-Item -Path ${this.POLICY_PATH}`)
                    await ps.invoke()
                }

                ps.addCommand(`Test-Path ${this.POLICY_SETUP_PATH}`)
                await ps.invoke()
                    .then(async output => {
                            if (!isEqual(removeLineBreaks(output), 'True')) {
                                ps.addCommand(`New-Item -Path ${this.POLICY_SETUP_PATH}`)
                                await ps.invoke()
                            }

                            //应用层WPD设备禁用以及只读策略
                            ps.addCommand(`Get-ItemProperty ${this.POLICY_SETUP_PATH}`)
                            await ps.invoke()
                                .then(async output => {
                                    let json = registryTxtToJson(output);
                                    //若策略项中不存在策略
                                    if (!('Deny_Read' in json) || !('Deny_Write' in json)) {
                                        res['status'] = 0
                                        res['result'] = '未配置WPD设备读写策略'
                                    } else {
                                        res['result'] = '已配置WPD设备读写策略\n' + `是否拒绝读取:${json.Deny_Read}\n` + `是否拒绝写入:${json.Deny_Write}\n`
                                        res['denyRead'] = json.Deny_Read
                                        res['denyWrite'] = json.Deny_Write
                                    }
                                }).catch(err => {
                                    ElectronLog.error(err);
                                })
                        }
                    )
                    .catch(err => {
                        ElectronLog.error(err);
                    })
            }).catch(err => {
                ElectronLog.error(err);
            })

        return res;
    }

    /**
     * @description: 禁用WPD设备读写策略
     * @author: wangcb
     * @date: 2023/3/7 16:51
     **/
    public async disableWpdPolicy(denyRead?: boolean, denyWrite?: boolean) {
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
