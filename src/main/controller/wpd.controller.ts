import {Controller, IpcHandle} from "einf";
import {WpdService} from "@main/service/wpd.service";
import {channels} from "@render/api/channels";

@Controller()
export class WpdController {
    constructor(
        private wpdService: WpdService,
    ) {
    }

    @IpcHandle(channels.wpd.policy.setup)
    public async wpdPolicySetup() {
        return await this.wpdService.wpdPolicySetup()
    }

    @IpcHandle(channels.wpd.policy.check)
    public async checkWpdPolicyPath() {
        return await this.wpdService.checkWpdPolicyPath()
    }

    @IpcHandle(channels.wpd.policy.create)
    public async createWpdPolicyPath() {
        let {policySetupPath, enablePolicyPath} = await this.wpdService.checkWpdPolicyPath();
        return await this.wpdService.createWpdPolicyPath(policySetupPath, enablePolicyPath)
    }

    @IpcHandle(channels.wpd.policy.setupEnable)
    public async wpdPolicySetupEnable() {
        return await this.wpdService.wpdPolicySetupEnable()
    }

    @IpcHandle(channels.wpd.policy.setDenyRead)
    public async setDenyRead(denyRead: number) {
        return await this.wpdService.setDenyRead(denyRead)
    }

    @IpcHandle(channels.wpd.policy.setDenyWrite)
    public async setDenyWrite(denyWrite: number) {
        return await this.wpdService.setDenyWrite(denyWrite)
    }

    @IpcHandle(channels.wpd.policy.readPolicyEnabled)
    public async wpdReadPolicyEnabled(enable: number) {
        return await this.wpdService.wpdReadPolicyEnabled(enable)
    }

    @IpcHandle(channels.wpd.policy.writePolicyEnabled)
    public async wpdWritePolicyEnabled(enable: number) {
        return await this.wpdService.wpdWritePolicyEnabled(enable)
    }

}
