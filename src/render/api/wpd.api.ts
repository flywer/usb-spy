import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";

export const stop_wpd_service = () => {
    return ipcInstance.send<string>(channels.wpd.stop)
}

export const start_wpd_service = () => {
    return ipcInstance.send<string>(channels.wpd.start)
}

export const wpd_policy_setup = () => {
    return ipcInstance.send<any>(channels.wpd.policy.setup)
}

export const check_wpd_policy_path = () => {
    return ipcInstance.send<any>(channels.wpd.policy.check)
}
export const create_wpd_policy_path = () => {
    return ipcInstance.send<any>(channels.wpd.policy.create)
}

export const wpd_policy_enable = () => {
    return ipcInstance.send<any>(channels.wpd.policy.setupEnable)
}
