import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home"
import DeviceInfo from "../views/DeviceInfo"
import About from "../views/About"
import AppManagement from "../views/AppManagement"
import InstallApp from "../views/InstallApp"

Vue.use(VueRouter)

const routes = [
  {
    name: "首页",
    path: "/",
    component: Home,
    redirect: "/appManagement",
    children: [
      {
        name: "应用管理",
        path: "/appManagement",
        component: AppManagement,
      },
      {
        name: "上传应用",
        path: "/installApp",
        component: InstallApp,
      },
      {
        name: "设备信息",
        path: "/deviceInfo",
        component: DeviceInfo,
      },
      {
        name: "关于",
        path: "/about",
        component: About,
      },
    ],
  },
]

const router = new VueRouter({
  routes,
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
