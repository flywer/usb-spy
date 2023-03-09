<script setup lang="ts">
import {sendMsgToMainProcess} from '@render/api'
import {useIpc} from '@render/plugins/ipc'
import {ref} from 'vue'
import {disable_usb, enable_usb, get_logical_letter, get_usb_status} from "@render/api/usb.api";
import {
  check_wpd_policy_path,
  create_wpd_policy_path,
  wpd_policy_enable,
  wpd_policy_setup, wpd_read_policy_enabled, wpd_set_deny_read, wpd_set_deny_write, wpd_write_policy_enabled
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
const getLogicalLetter = async () => {
  const {data} = await get_logical_letter('')
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
const wpdSetDenyRead = async (denyRead: 1 | 0) => {
  const {data} = await wpd_set_deny_read(denyRead)
  log.value += `[main]: ${data.result}  \n`
}
const wpdSetDenyWrite = async (denyWrite: 1 | 0) => {
  const {data} = await wpd_set_deny_write(denyWrite)
  log.value += `[main]: ${data.result}  \n`
}
const wpdReadPolicyEnabled = async (enable: 1 | 0) => {
  const {data} = await wpd_read_policy_enabled(enable)
  log.value += `[main]: ${data.result}  \n`
}
const wpdWritePolicyEnabled = async (enable: 1 | 0) => {
  const {data} = await wpd_write_policy_enabled(enable)
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
      <button style="margin-left: 20px" @click="getUsbStatus">获取USB移动储存设备状态</button>

      <button style="margin-left: 20px" @click="disableUsb">禁用USB移动储存设备连接</button>

      <button style="margin-left: 20px" @click="enableUsb">启用USB移动储存设备连接</button>
<!--      <button style="margin-left: 20px" @click="getLogicalLetter">获取盘符</button>-->


    </div>
    <div style="margin-top: 20px">

      <button style="margin-left: 20px" @click="checkWpdPolicyPath">检查WPD设备策略路径</button>

      <button style="margin-left: 20px" @click="createWpdPolicyPath">创建WPD设备策略</button>

      <button style="margin-left: 20px" @click="wpdPolicySetup">获取WPD设备策略状态</button>

      <button style="margin-left: 20px" @click="wpdPolicySetupEnable">获取WPD设备策略启用状态</button>
    </div>
    <div style="margin-top: 20px">
      <button style="margin-left: 20px" @click="wpdSetDenyRead(0)">WPD设备可读</button>
      <button style="margin-left: 20px" @click="wpdSetDenyRead(1)">WPD设备不可读</button>
      <button style="margin-left: 20px" @click="wpdSetDenyWrite(0)">WPD设备可写</button>
      <button style="margin-left: 20px" @click="wpdSetDenyWrite(1)">WPD设备不可写</button>
    </div>
    <div style="margin-top: 20px">
      <button style="margin-left: 20px" @click="wpdReadPolicyEnabled(1)">启用WPD设备读策略</button>
      <button style="margin-left: 20px" @click="wpdReadPolicyEnabled(0)">禁用WPD设备读策略</button>
      <button style="margin-left: 20px" @click="wpdWritePolicyEnabled(1)">启用WPD设备写策略</button>
      <button style="margin-left: 20px" @click="wpdWritePolicyEnabled(0)">禁用WPD设备写策略</button>
    </div>
  </div>
</template>

<style>
</style>
