import {ipcInstance} from "@render/plugins";
import {channels} from "@render/api/channels";

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

export const wpd_set_deny_read = (denyRead: 1 | 0) => {
    return ipcInstance.send<any>(channels.wpd.policy.setDenyRead, denyRead)
}

export const wpd_set_deny_write = (denyWrite: 1 | 0) => {
    return ipcInstance.send<any>(channels.wpd.policy.setDenyWrite, denyWrite)
}

export const wpd_read_policy_enabled = (enable: 1 | 0) => {
    return ipcInstance.send<any>(channels.wpd.policy.readPolicyEnabled, enable)
}

export const wpd_write_policy_enabled = (enable: 1 | 0) => {
    return ipcInstance.send<any>(channels.wpd.policy.writePolicyEnabled, enable)
}
