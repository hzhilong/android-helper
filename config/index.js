const devEnv = require("./env.dev")
const prodEnv = require("./env.prod")

const config = {
  APP_NAME: process.env.VUE_APP_PRODUCT_NAME,
  IS_DEV_MODE: process.env.NODE_ENV !== "production",
  APP_AUTHOR: process.env.VUE_APP_AUTHOR_NAME,
  GITHUB_URL: process.env.VUE_APP_AUTHOR_URL,
}

let configParams = config.IS_DEV_MODE ? devEnv : prodEnv
Object.keys(configParams).forEach(key => {
  if (config[key] !== undefined) {
    config[key] = configParams[key]
  }
})

module.exports = config
