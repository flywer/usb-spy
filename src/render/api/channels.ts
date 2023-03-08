import {reactive} from "vue";

export const channels = reactive({
    window: {},
    usb: {
        status: 'usb/status',
        disable: 'usb/disable',
        enable: 'usb/enable',
    },
    wpd: {
        stop: 'wpd/stop',
        start: 'wpd/start',
        policy: {
            setup: 'wpd/policy/setup',
            check: "wpd/policy/check",
            create: "wpd/policy/create",
            setupEnable:'wpd/policy/setupEnable'
        }
    }
})
