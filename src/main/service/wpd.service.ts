import {Injectable} from "einf";
import {ADMIN_START, ps} from "@main/powershell";
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
        let policySetupPath = false //策略路径
        let enablePolicyPath = false //策略启用设置路径

        ps.addCommand(`Test-Path ${this.POLICY_PATH}`)
        await ps.invoke()
            .then(async output => {
                //若没有此项则新增
                policyPath = isEqual(removeLineBreaks(output), 'True');
            }).catch(err => {
                ElectronLog.error(err);
            })

        //存在根目录则继续检测
        if (policyPath) {
            ps.addCommand(`Test-Path ${this.POLICY_SETUP_PATH} `)
            await ps.invoke()
                .then(async output => {
                    policySetupPath = isEqual(removeLineBreaks(output), 'True');
                })
                .catch(err => {
                    ElectronLog.error(err);
                })

            ps.addCommand(`Test-Path ${this.ENABLE_POLICY_PATH} `)
            await ps.invoke()
                .then(async output => {
                    enablePolicyPath = isEqual(removeLineBreaks(output), 'True');
                })
                .catch(err => {
                    ElectronLog.error(err);
                })
        }

        return {policySetupPath, enablePolicyPath};
    }

    /**
     * @description: 若无路径，则创建路径，并赋初值
     * @author: wangcb
     * @date: 2023/3/7 18:04
     **/
    public async createWpdPolicyPath(policyPath: boolean, enablePolicyPath: boolean) {

        //两个路径都没有，可能是原本就没有策略，需要创建根目录
        if (!policyPath && !enablePolicyPath) {
            ps.addCommand(`Test-Path ${this.POLICY_PATH}`)
            await ps.invoke()
                .then(async output => {
                    //若没有此项则新增
                    if (!isEqual(removeLineBreaks(output), 'True')) {
                        ps.addCommand(`${ADMIN_START} "New-Item -ItemType Directory ${this.POLICY_PATH}" `)
                        await ps.invoke()
                    }
                }).catch(err => {
                    ElectronLog.error(err);
                })
        }

        if (!policyPath) {
            ps.addCommand(`${ADMIN_START} "New-Item -ItemType Directory ${this.POLICY_SETUP_PATH}" `)
            ps.addCommand(`${ADMIN_START} "New-ItemProperty -Path ${this.POLICY_SETUP_PATH} -Name \'Deny_Read\' -Value 1 -PropertyType DWORD" `)
            ps.addCommand(`${ADMIN_START} "New-ItemProperty -Path ${this.POLICY_SETUP_PATH} -Name \'Deny_Write\' -Value 1 -PropertyType DWORD" `)
        }
        if (!enablePolicyPath) {
            ps.addCommand(`${ADMIN_START} "New-Item -ItemType Directory ${this.ENABLE_POLICY_PATH}" `)
            ps.addCommand(`${ADMIN_START} "New-ItemProperty -Path ${this.ENABLE_POLICY_PATH} -Name \'Deny_Read\' -Value 0 -PropertyType DWORD" `)
            ps.addCommand(`${ADMIN_START} "New-ItemProperty -Path ${this.ENABLE_POLICY_PATH} -Name \'Deny_Write\' -Value 0 -PropertyType DWORD" `)
        }

        if (!policyPath || !enablePolicyPath) {
            await ps.invoke()
                .catch(err => {
                    ElectronLog.error(err);
                })
        }

        return 'WPD设备策略路径创建完毕'
    }

    /**
     * @description: 获取WPD设备读写策略
     * @author: wangcb
     * @date: 2023/3/7 16:00
     **/
    public async wpdPolicySetup() {
        let res: any = {};
        const {policySetupPath} = await this.checkWpdPolicyPath()
        if (policySetupPath) {
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
        } else {
            res['result'] = 'wpd策略路径不存在'
        }

        return res;
    }

    /**
     * @description: 检测wpd读写策略设置是否启用
     * @author: wangcb
     * @date: 2023/3/8 9:44
     **/
    async wpdPolicySetupEnable() {
        let res: any = {};
        const {policySetupPath, enablePolicyPath} = await this.checkWpdPolicyPath()
        if (enablePolicyPath && policySetupPath) {
            ps.addCommand(`Get-ItemProperty ${this.ENABLE_POLICY_PATH}`)
            await ps.invoke()
                .then(async output => {
                    let json = registryTxtToJson(output);
                    //若策略项中不存在策略
                    if (!('Deny_Read' in json) || !('Deny_Write' in json)) {
                        res['status'] = 0
                        res['result'] = '未配置WPD设备读写策略启用设置'
                    } else {
                        res['result'] = '已配置WPD设备读写策略启用设置\n' + `是否启用拒绝读取策略:${json.Deny_Read}\n` + `是否启用拒绝写入策略:${json.Deny_Write}\n`
                        res['denyRead'] = json.Deny_Read
                        res['denyWrite'] = json.Deny_Write
                    }
                }).catch(err => {
                    ElectronLog.error(err);
                })
        } else {
            res['result'] = 'wpd策略路径不存在'
        }

        return res;
    }

    /**
     * @description:  设置WPD设备读策略
     * @author: wangcb
     * @date: 2023/3/8 10:02
     **/
    public async setDenyRead(denyRead: number) {
        let res: any = {};
        const {policySetupPath} = await this.checkWpdPolicyPath()
        if (policySetupPath) {
            ps.addCommand(`${ADMIN_START} "Set-ItemProperty -Path ${this.POLICY_SETUP_PATH} -Name \'Deny_Read\' -Value ${denyRead} " `)
            await ps.invoke()
                .catch(err => {
                    ElectronLog.error(err);
                })
            res['result'] = 'wpd设备读策略设置完成'
        } else {
            res['result'] = 'wpd策略路径不存在'
        }
        return res;
    }

    /**
     * @description: 设置WPD设备写策略
     * @author: wangcb
     * @date: 2023/3/8 10:51
     **/
    public async setDenyWrite(denyWrite: number) {
        let res: any = {};
        const {policySetupPath} = await this.checkWpdPolicyPath()
        if (policySetupPath) {
            ps.addCommand(`${ADMIN_START} "Set-ItemProperty -Path ${this.POLICY_SETUP_PATH} -Name \'Deny_Write\' -Value ${denyWrite} " `)
            await ps.invoke()
                .catch(err => {
                    ElectronLog.error(err);
                })
            res['result'] = 'wpd设备写策略设置完成'
        } else {
            res['result'] = 'wpd策略路径不存在'
        }
        return res;
    }

    /**
     * @description: 读策略是否启用
     * @author: wangcb
     * @date: 2023/3/8 10:52
     **/
    public async wpdReadPolicyEnabled(enable: number) {
        let res: any = {};
        const {enablePolicyPath} = await this.checkWpdPolicyPath()
        if (enablePolicyPath) {
            console.log(`${ADMIN_START} "Set-ItemProperty -Path ${this.ENABLE_POLICY_PATH} -Name \'Deny_Read\' -Value ${enable} " `)
            ps.addCommand(`${ADMIN_START} "Set-ItemProperty -Path ${this.ENABLE_POLICY_PATH} -Name \'Deny_Read\' -Value ${enable} " `)
            await ps.invoke()
                .catch(err => {
                    ElectronLog.error(err);
                })
            if (isEqual(enable, 1)) {
                res['result'] = 'wpd设备读策略已启用'
            } else {
                res['result'] = 'wpd设备读策略已禁用'
            }
        } else {
            res['result'] = 'wpd策略路径不存在'
        }
        return res;
    }

    /**
     * @description: 写策略是否启用
     * @author: wangcb
     * @date: 2023/3/8 10:52
     **/
    public async wpdWritePolicyEnabled(enable: number) {
        let res: any = {};
        const {enablePolicyPath} = await this.checkWpdPolicyPath()
        if (enablePolicyPath) {
            ps.addCommand(`${ADMIN_START} "Set-ItemProperty -Path ${this.ENABLE_POLICY_PATH} -Name \'Deny_Write\' -Value ${enable} " `)
            await ps.invoke()
                .catch(err => {
                    ElectronLog.error(err);
                })
            if (isEqual(enable, 1)) {
                res['result'] = 'wpd设备写策略已启用'
            } else {
                res['result'] = 'wpd设备写策略已禁用'
            }
        } else {
            res['result'] = 'wpd策略路径不存在'
        }
        return res;
    }
}
