import {Controller, IpcHandle} from "einf";
import {WpdService} from "@main/service/wpd.service";
import {channels} from "@render/api/channels";

@Controller()
export class WpdController {
    constructor(
        private wpdService: WpdService,
    ) {
    }

    @IpcHandle(channels.wpd.stop)
    public async stopWpdService() {
        return await this.wpdService.disableWpdPolicy()
    }

    @IpcHandle(channels.wpd.start)
    public async startWpdService() {
        return await this.wpdService.startWpdService()
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
        let {policyPath, enablePolicyPath} = await this.wpdService.checkWpdPolicyPath();
        return await this.wpdService.createWpdPolicyPath(policyPath, enablePolicyPath)
    }
}
