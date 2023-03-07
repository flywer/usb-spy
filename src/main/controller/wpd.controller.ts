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
        return await this.wpdService.stopWpdService()
    }

    @IpcHandle(channels.wpd.start)
    public async startWpdService() {
        return await this.wpdService.startWpdService()
    }

    @IpcHandle(channels.wpd.policy.setup)
    public async wpdPolicySetup() {
        return await this.wpdService.wpdPolicySetup()
    }
}
