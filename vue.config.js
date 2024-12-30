"use strict"
const Config = require("./config/index")
const aliasConfig = require("./alias.config")
const webpack = require("webpack")

process.env.VUE_APP_VERSION = require("./package.json").version

module.exports = function resolveClientEnv(options, raw) {
  let envParams = {}
  Object.keys(process.env).forEach(key => {
    if (key.startsWith("VUE_APP_")) {
      envParams[key] = process.env[key]
    }
  })
  if (Object.keys(envParams).length > 0) {
    console.log("-------------环境变量-------------")
    Object.keys(envParams).forEach(key => {
      console.log(key, "\t", envParams[key])
    })
  }
  console.log("-------------配置参数-------------")
  console.log(Config)
  console.log("---------------------------------")

  return {
    devServer: {
      port: 8087,
      proxy: {
        "/apkInfo": {
          target: "https://***apk/", // 你请求的第三方接口
          changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
          pathRewrite: {
            // 路径重写，
            "^/apkInfo/": "", // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX这个地址的时候直接写成/api即可。
          },
        },
      },
    },
    publicPath: "./",
    chainWebpack: config => {
      config.plugin("html").tap(args => {
        args[0].title = Config.APP_NAME + " " + process.env.VUE_APP_VERSION
        return args
      })
      let aliasKeys = Object.keys(aliasConfig.resolve.alias)
      if (aliasKeys && aliasKeys.length > 0) {
        let alias = config.resolve.alias
        aliasKeys.forEach(key => {
          alias.set(key, aliasConfig.resolve.alias[key])
        })
      }
    },
    configureWebpack: {
      plugins: [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          "windows.jQuery": "jquery",
        }),
      ],
    },
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          win: {
            icon: "./public/app_logo.ico",
          },
          mac: {
            // icon: "./public/app.png",
          },
          productName: Config.APP_NAME,
          asar: false,
          extraResources: {
            from: "./resources/adb/",
            to: "./adb",
          },
        },
      },
    },
  }
}
