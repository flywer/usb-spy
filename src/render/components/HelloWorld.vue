<script setup lang="ts">
import {disableUsb, enableUsb, getUsbInfo1, sendMsgToMainProcess} from '@render/api'
import {useIpc} from '@render/plugins/ipc'
import {ref} from 'vue'

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

const bannedUsb = async () => {
  const {data} = await disableUsb()
  log.value += `[main]: ${data}  \n`
}
const enableUsb1 = async () => {
  const {data} = await enableUsb()
  log.value += `[main]: ${data}  \n`
}

const getUsbInfo = async () => {
  const {data} = await getUsbInfo1()
  log.value += `[main]: ${data}  \n`
}

const clear = () => {
   log.value =''
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
      <button style="margin-left: 20px" @click="getUsbInfo">获取USB设备状态</button>

      <button style="margin-left: 20px" @click="bannedUsb">禁用USB</button>

      <button style="margin-left: 20px" @click="enableUsb1">启用USB</button>
    </div>

  </div>
</template>

<style>
</style>
