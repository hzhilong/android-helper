import Vue from "vue"
import AdbUtil from "utils/adb-util"

// 配置参数
const Config = require("../../config")
// 阻止启动生产消息
Vue.config.productionTip = Config.IS_DEV_MODE

setTimeout(() => {
  AdbUtil.getAdbVersion().then(result => {
    if (result.stderr || !result.stdout) {
      window._modal("缺少adb文件，请重新安装", "error")
    }
  })
}, 2000)
