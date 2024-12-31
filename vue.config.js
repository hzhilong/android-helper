"use strict"
const aliasConfig = require("./alias.config")
const webpack = require("webpack")
const packageJson = require("./package.json")
const path = require("path")

process.env.VUE_APP_NAME = packageJson.name
process.env.VUE_APP_PRODUCT_NAME = packageJson.productName
process.env.VUE_APP_VERSION = packageJson.version
process.env.VUE_APP_AUTHOR_NAME = packageJson.author.name
process.env.VUE_APP_AUTHOR_URL = packageJson.author.url

module.exports = function resolveClientEnv(options, raw) {
  return {
    devServer: {
      port: 8087,
    },
    publicPath: "./",
    chainWebpack: config => {
      config.plugin("html").tap(args => {
        args[0].title = process.env.VUE_APP_PRODUCT_NAME + " " + process.env.VUE_APP_VERSION
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
          mac: {},
          productName: process.env.VUE_APP_PRODUCT_NAME,
          artifactName: process.env.VUE_APP_NAME + "_" + process.env.VUE_APP_VERSION + ".${ext}",
          asar: true,
          extraResources: {
            from: "./resources/adb/",
            to: "./adb",
          },
          nsis: {
            oneClick: false,
            perMachine: false,
            allowToChangeInstallationDirectory: true,
            deleteAppDataOnUninstall: false,
            license: path.join(__dirname, "LICENSE"),
            createDesktopShortcut: true,
            createStartMenuShortcut: true,
          },
        },
      },
    },
  }
}
