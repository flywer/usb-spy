import {reactive} from "vue";

export const channels = reactive({
    window: {},
    usb: {
        status: 'usb/status',
        disable: 'usb/disable',
        enable: 'usb/enable',
        eject: 'usb/eject',
        logical: 'usb/logical'
    },
    wpd: {
        stop: 'wpd/stop',
        start: 'wpd/start',
        policy: {
            setup: 'wpd/policy/setup',
            check: "wpd/policy/check",
            create: "wpd/policy/create",
            setupEnable: 'wpd/policy/setupEnable',
            setDenyRead: 'wpd/policy/setDenyRead',
            setDenyWrite: 'wpd/policy/setDenyWrite',
            readPolicyEnabled: 'wpd/policy/readPolicyEnabled',
            writePolicyEnabled: 'wpd/policy/writePolicyEnabled',
        }
    }
})
