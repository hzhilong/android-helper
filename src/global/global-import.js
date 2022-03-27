// 引入组件
import Vue from "vue"
import router from "../router"
import Loading from "../components/loading/Loading"
import ViewUI from "view-design"
// 引入样式
import "view-design/dist/styles/iview.css"
import { on } from "view-design/src/utils/dom"

// 引入其他全局js
const Config = require("../../config/index")

// 使用组件
Vue.use(Loading)
Vue.use(ViewUI)

// 设置全局变量
window.Config = Config
window._is_root = false
Vue.prototype.Router = router

// 信息提示 msg, flag('success', 'error', 'info')
window._message = (msg, flag = "success") => {
  if (flag === "success") {
    ViewUI.Message.success(msg)
  } else if (flag === "error") {
    ViewUI.Message.error(msg)
  } else {
    ViewUI.Message.info(msg)
  }
}
// 弹窗提示 info success warning error
window._modal = (msg, flag = "info", title = "提示") => {
  ViewUI.Modal[flag]({
    title: title,
    content: msg,
  })
}
// 确认框
window._confirm = (content, onOk, onCancel) => {
  let opt = {
    title: "提示",
    content: "<p>" + content + "</p>",
    onOk: () => {
      if (onOk) {
        onOk()
      }
    },
  }
  if (onCancel != undefined) {
    opt.onCancel = onCancel
  }
  ViewUI.Modal.confirm(opt)
}
// 日志打印
window._log = (...content) => {
  console.log(
    `%c ${content} %c`,
    "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
    "background:transparent"
  )
}
