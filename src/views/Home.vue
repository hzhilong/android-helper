<template>
  <div class="home-container">
    <div class="left-container">
      <div class="device-container">
        <Select
          class="device-name"
          style="width:120px"
          size="small"
          placeholder="请选择设备"
          not-found-text="设备未连接"
          v-model="currDeviceId"
          @on-change="onChangeDevice"
        >
          <Option v-for="item in deviceIdList" :value="item" :key="item">
            {{ item }}
          </Option>
        </Select>
        <span
          class="btn-refresh iconfont icon-refresh rotate"
          :class="isDeviceRefreshing ? 'active' : ''"
          @click="refreshDevice"
        ></span>
        <Tooltip :content="isRoot ? '取消root权限' : '获取root权限'" v-if="false">
          <span class="iconfont icon-root" :class="isRoot ? 'active' : ''" @click="getRoot"></span>
        </Tooltip>
      </div>
      <div class="menus">
        <div
          class="menu-item"
          v-for="(menu, index) in menus"
          :class="menuStyle(menu, index)"
          :key="menu.text"
          @click="onClickMenu(index, menu)"
        >
          <span class="menu-text iconfont" :class="'icon-' + menu.icon">{{ menu.text }}</span>
        </div>
      </div>
      <div class="app-about-container">
        作者: {{ appAuthor }}
        <img class="github-image" @click="gotoGithub" />
      </div>
    </div>
    <div class="right-container">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
  import AdbUtil from "utils/adb-util"

  const ipcRenderer = window.electron.ipcRenderer
  const shell = window.electron.shell

  export default {
    name: "Home",
    data() {
      return {
        menuIndex: 0,
        menus: [
          {
            text: "应用管理", //TODO 备份、卸载、冻结、应用详情
            icon: "app",
            viewPath: "/appManagement",
          },
          {
            text: "上传应用",
            icon: "app2",
            viewPath: "/installApp",
          },
          // {
          //   text: "设备信息",
          //   icon: "android",
          //   viewPath: "/deviceInfo",
          // },
          // {
          //   text: "关于",
          //   icon: "about",
          //   viewPath: "/about",
          // },
          {
            text: "退出",
            icon: "out",
            viewPath: "/appManagement",
          },
          //TODO 手机信息/拖动安装apk
          //TODO 手机实时截图
          // TODO 卸载当前打开的软件
        ],

        // 当前选择的设备
        // 当前查询到的设备
        deviceIdList: [],
        currDeviceId: null,
        // 是否正在刷新设备
        isDeviceRefreshing: false,
        appAuthor: "",
        isRoot: false,
      }
    },
    created() {},
    mounted() {
      this.appAuthor = window.Config.APP_AUTHOR
    },
    methods: {
      menuStyle(menu, index) {
        return this.menuIndex == index ? "active" : ""
      },
      onClickMenu(index) {
        if (index === this.menus.length - 1) {
          ipcRenderer.send("closeWindow")
          return
        }
        this.menuIndex = index
        AdbUtil.initAAPT(this.currDeviceId)
        this.$router.push({
          path: this.menus[index].viewPath,
          query: {
            t: new Date().getTime(),
            deviceId: this.currDeviceId,
          },
        })
      },
      refreshDevice() {
        // 当前的可执行文件所在目录
        if (!this.isDeviceRefreshing) {
          this.currDeviceId = null
          this.deviceIdList = []
          this.isDeviceRefreshing = true
          AdbUtil.getDeviceList().then(result => {
            this.isDeviceRefreshing = false
            this.deviceIdList = result.deviceIdList
            if (this.deviceIdList.length > 0) {
              this.currDeviceId = this.deviceIdList[0]
              this.onClickMenu(this.menuIndex)
            } else {
              window._message("设备未连接", "error")
              this.currDeviceId = ""
              this.onClickMenu(this.menuIndex)
            }
          })
        } else {
          window._message("正在刷新", "info")
        }
      },
      onChangeDevice(value) {
        if (!this.isDeviceRefreshing) {
          this.currDeviceId = value
          this.onClickMenu(this.menuIndex)
        }
      },
      gotoGithub() {
        shell.openExternal(window.Config.GITHUB_URL)
      },
      getRoot() {
        window._is_root = this.isRoot = !this.isRoot
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/home";
</style>
