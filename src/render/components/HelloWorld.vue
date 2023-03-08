<script setup lang="ts">
import {sendMsgToMainProcess} from '@render/api'
import {useIpc} from '@render/plugins/ipc'
import {ref} from 'vue'
import {disable_usb, enable_usb, get_usb_status} from "@render/api/usb.api";
import {
  check_wpd_policy_path,
  create_wpd_policy_path,
  start_wpd_service,
  stop_wpd_service, wpd_policy_enable,
  wpd_policy_setup
} from "@render/api/wpd.api";

const props = defineProps({
  title: {
    type: String,
    default: 'USB-SPY DEMO',
  },
})

const log = ref('')
const msg = ref('')

const sendMsg = async () => {
  try {
    log.value += `[render]: ${msg.value} \n`
    const {data} = await sendMsgToMainProcess(msg.value)
    log.value += `[main]: ${data}  \n`
  } catch (error) {
    console.error(error)
  }
}

const getUsbStatus = async () => {
  const {data} = await get_usb_status()
  log.value += `[main]: ${data}  \n`
}

const disableUsb = async () => {
  const {data} = await disable_usb()
  log.value += `[main]: ${data}  \n`
}
const enableUsb = async () => {
  const {data} = await enable_usb()
  log.value += `[main]: ${data}  \n`
}

const stopWpdService = async () => {
  const {data} = await stop_wpd_service()
  log.value += `[main]: ${data}  \n`
}

const startWpdService = async () => {
  const {data} = await start_wpd_service()
  log.value += `[main]: ${data}  \n`
}

const wpdPolicySetup = async () => {
  const {data} = await wpd_policy_setup()
  log.value += `[main]: ${data.result}  \n`
}
const checkWpdPolicyPath = async () => {
  const {data} = await check_wpd_policy_path()
  log.value += `[main]: ${JSON.stringify(data)}  \n`
}
const createWpdPolicyPath = async () => {
  const {data} = await create_wpd_policy_path()
  log.value += `[main]: ${JSON.stringify(data)}  \n`
}
const wpdPolicySetupEnable = async () => {
  const {data} = await wpd_policy_enable()
  log.value += `[main]: ${data.result}  \n`
}

const clear = () => {
  log.value = ''
}

const ipc = useIpc()

ipc.on('reply-msg', (msg: string) => {
  log.value += `[main]: ${msg}  \n`
})

ipc.on('usb-add', (msg) => {
  log.value += `[main]: 新增设备 ${JSON.stringify(msg)}  \n`
})

ipc.on('usb-remove', (msg) => {
  log.value += `[main]: 移除设备 ${JSON.stringify(msg)}  \n`
})

</script>

<template>
  <h1>{{ title }}</h1>

  <textarea v-model="log" cols="60" rows="10" disabled/>
  <div style="margin-top: 20px">
    <input v-model="msg" type="text" placeholder="send msg to main process">
    <button style="margin-left: 20px" @click="sendMsg">
      Send
    </button>
    <button style="margin-left: 20px" @click="clear">清空</button>
    <div style="margin-top: 20px">
      <button style="margin-left: 20px" @click="getUsbStatus">获取USB设备状态</button>

      <button style="margin-left: 20px" @click="disableUsb">禁用USB</button>

      <button style="margin-left: 20px" @click="enableUsb">启用USB</button>
    </div>
    <div style="margin-top: 20px">

      <button style="margin-left: 20px" @click="checkWpdPolicyPath">检查WPD设备策略路径</button>

      <button style="margin-left: 20px" @click="createWpdPolicyPath">创建WPD设备策略</button>

      <button style="margin-left: 20px" @click="wpdPolicySetup">获取WPD设备策略状态</button>

      <button style="margin-left: 20px" @click="wpdPolicySetupEnable">获取WPD设备策略启用状态</button>
    </div>
    <div style="margin-top: 20px">
      <button style="margin-left: 20px" @click="stopWpdService">禁用WPD服务</button>

      <button style="margin-left: 20px" @click="startWpdService">开启WPD服务</button>
    </div>

  </div>
</template>

<style>
</style>
