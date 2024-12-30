import Vue from "vue"
import VueRouter from "vue-router"
import Home from "../views/Home"
import Cmd from "views/Cmd.vue"
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
        name: "常用命令",
        path: "/cmd",
        component: Cmd,
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
