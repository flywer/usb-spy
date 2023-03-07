import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";

export const stop_wpd_service = () => {
    return ipcInstance.send<string>(channels.wpd.stop)
}
export const start_wpd_service = () => {
    return ipcInstance.send<string>(channels.wpd.start)
}

export const wpd_policy_setup = () => {
    return ipcInstance.send<string>(channels.wpd.policy.setup)
}
