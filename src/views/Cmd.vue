<template>
  <div class="page-container">
    <Button class="open-cmd" @click="openCmd">打开adb命令行窗口</Button>
    <Card class="btn-group" dis-hover v-for="(group, index) in cmdGroup" :key="index">
      <div class="title">
        <div class="group-name">{{ group.name }}</div>
      </div>
      <p class="btn-list">
        <Button
          type="primary"
          class="btn"
          v-for="cmd in group.cmdList"
          :key="cmd.name"
          @click="runCmd(cmd.cmd)"
        >
          {{ cmd.name }}
        </Button>
      </p>
    </Card>
  </div>
</template>

<script>
  import AdbUtil from "utils/adb-util"

  export default {
    name: "AdbCmd",
    data: function() {
      return {
        cmdGroup: [
          {
            name: "adb 常用命令",
            cmdList: [
              {
                name: "重启设备",
                cmd: "adb reboot",
              },
              {
                name: "重启到9008模式",
                cmd: "adb reboot edl",
              },
              {
                name: "重启到Bootloader模式",
                cmd: "adb reboot bootloader",
              },
              {
                name: "重启到Recovery模式",
                cmd: "adb reboot recovery",
              },
            ],
          },
          {
            name: "fastboot 常用命令",
            cmdList: [
              {
                name: "重启设备",
                cmd: "fastboot reboot",
              },
              {
                name: "重启到9008模式",
                cmd: "fastboot reboot edl",
              },
              {
                name: "重启到Bootloader模式",
                cmd: "fastboot reboot bootloader",
              },
              {
                name: "重启到Recovery模式",
                cmd: "fastboot reboot recovery",
              },
            ],
          },
        ],
      }
    },
    methods: {
      openCmd() {
        AdbUtil.openAdb()
      },
      runCmd(cmd) {
        AdbUtil.exec([cmd])
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/adb";
</style>
