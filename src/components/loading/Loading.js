import Vue from "vue"
import LoadingComponent from "./Loading.vue"

const Loading = {}
let showLoading = false // 存储loading显示状态
let loadingNode = null // 存储loading节点元素
const LoadingConstructor = Vue.extend(LoadingComponent)

Loading.install = function(Vue) {
  Vue.prototype.$loading = function(tips, maskCloseAble, onCancel, type) {
    if (type === "hide") {
      loadingNode.isShowLoading = showLoading = false
    } else {
      if (showLoading) {
        // 如果loading还在，则不再执行
        return
      }
      loadingNode = new LoadingConstructor({
        data: {
          isShowLoading: showLoading,
          content: tips,
          maskCloseAble: maskCloseAble,
          onCancel: onCancel,
        },
      })
      loadingNode.$mount() // 挂在实例，为了获取下面的loadingNode.$el
      document.body.appendChild(loadingNode.$el)
      loadingNode.isShowLoading = showLoading = true
    }
  }

  Vue.prototype.$loading.show = function(tips = "loading", maskCloseAble = false, onCancel = null) {
    return Vue.prototype.$loading(tips, maskCloseAble, onCancel, "show")
  }
  Vue.prototype.$loading.hide = function() {
    return Vue.prototype.$loading("", false, null, "hide")
  }
}

Loading.show = function(tips = "loading", maskCloseAble = false, onCancel = null) {
  Vue.prototype.$loading(tips, maskCloseAble, onCancel, "show")
}

Loading.hide = function() {
  return Vue.prototype.$loading("", false, null, "hide")
}

export default Loading
