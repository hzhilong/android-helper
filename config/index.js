const devEnv = require("./env.dev")
const prodEnv = require("./env.prod")

// 全局配置参数
// 名称
let APP_NAME = "Android 助手"
// 是否开发模式 也可以自己读process.env吧
let IS_DEV_MODE = true
let APP_AUTHOR = "hzhilong"
let GITHUB_URL = "https://github.com/hzhilong/androidhelper"

module.exports = {
  APP_NAME,
  IS_DEV_MODE,
  APP_AUTHOR,
  GITHUB_URL,
  setParams(key, value) {
    module.exports[key] = value
  },
}

// 初始化
module.exports.IS_DEV_MODE = process.env.NODE_ENV !== "production"
let configParams = module.exports.IS_DEV_MODE ? devEnv : prodEnv
Object.keys(configParams).forEach(key => {
  if (module.exports[key] !== undefined) {
    module.exports[key] = configParams[key]
  }
})
