const util = require("util")
const iconv = require("iconv-lite")
iconv.skipDecodeWarning = true
const cpExec = window.require("child_process").exec
const adbPath = ".\\resources\\adb\\"

function exec(cmds, options = {}, isDecodeStr = true) {
  // console.log(cmds, options)
  if (options === null || options === undefined) options = {}
  // if (isDecodeStr) options.encoding = "binary"
  if (isDecodeStr) options.encoding = "binary"
  options.cwd = "./"
  for (let i = 0; i < cmds.length; i++) {
    cmds[i] = adbPath + cmds[i].trim()
  }
  return new Promise((resolve, reject) => {
    cpExec(cmds.join(" && "), options, (error, stdout, stderr) => {
      if (isDecodeStr) {
        stderr = decodeCmdResultStr(stderr)
        stdout = decodeCmdResultStr(stdout)
      }
      if (stdout.startsWith("adb: error")) {
        resolve({ stderr: stdout })
      } else if (stderr) {
        resolve({ stderr, stdout })
      } else {
        resolve({ stderr, stdout })
      }
    })
  })
}

function decodeCmdResultStr(str) {
  if (!str) {
    return ""
  }
  // 先用binary来存储输出的文本，再用iconv来以cp936解析，防止中文乱码
  return iconv.decode(new Buffer(str, "binary"), "utf-8")
}

/**
 * 检查adb环境
 */
function getAdbVersion() {
  return exec(["adb version"])
}

/**
 * 获取设备列表
 */
function getDeviceList() {
  return new Promise((resolve, reject) => {
    exec(["adb devices"]).then(result => {
      let deviceIdList = []
      result.stdout.split("\n").forEach(line => {
        line = line.trim()
        if (line.indexOf("List of devices attached") < 0) {
          let [deviceId, status] = line.split("	")
          if (status === "device") deviceIdList.push(deviceId)
        }
      })
      result.deviceIdList = deviceIdList
      resolve(result)
    })
  })
}

/**
 * 获取第三方应用包名
 * @param params
 *     无    所有应用
 -f    显示应用关联的 apk 文件
 -d    只显示 disabled 的应用
 -e    只显示 enabled 的应用
 -s    只显示系统应用
 -3    只显示第三方应用
 -i    显示应用的 installer
 -u    包含已卸载应用
 <FILTER>    包名包含 <FILTER> 字符串
 * @returns {Promise<unknown>}
 */
function getPackages(deviceId, params) {
  return new Promise((resolve, reject) => {
    exec(["adb -s " + deviceId + " shell pm list packages " + params]).then(result => {
      let packages = []
      if (result.stdout) {
        result.stdout.split("\n").forEach(line => {
          let p = line.substr(8).trim()
          if (p) {
            packages.push(p)
          }
        })
      }
      result.packages = packages
      resolve(result)
    })
  })
}

function initAAPT(deviceId) {
  return new Promise((resolve, reject) => {
    let tempStart = "adb -s " + deviceId + " "
    exec([
      tempStart + "push " + adbPath + "aapt-arm-pie /data/local/tmp",
      tempStart + "shell chmod 0755 /data/local/tmp/aapt-arm-pie",
    ]).then(result => {
      resolve(result)
    })
  })
}

/**
 * 获取应用信息
 * @param deviceId
 * @param packageName
 * @returns {Promise<unknown>}
 */
function getApkInfo(deviceId, packageName) {
  return new Promise((resolve, reject) => {
    let tempStart = "adb -s " + deviceId + " "
    exec([tempStart + "shell pm path " + packageName]).then(result => {
      let path = result.stdout.substr(8).split("\n")[0]
      exec(
        [
          tempStart +
            "shell /data/local/tmp/aapt-arm-pie d badging " +
            path.trim() +
            ' | findstr /i "versionName application-label: application-label-zh-CN:"',
        ],
        {},
        false
      ).then(result2 => {
        let info = {}
        result2.stdout.split("\n").forEach((line, index) => {
          if (index === 0) {
            let paramStrs = line.split(" ")
            paramStrs.shift()
            paramStrs.forEach(paramsStr => {
              if (paramsStr.indexOf("name=") === 0) {
                info.packageName = paramsStr.substring(6, paramsStr.length - 1)
              } else if (paramsStr.indexOf("versionName=") === 0) {
                info.versionName = paramsStr.substring(13, paramsStr.length - 1)
              }
            })
          } else if (line.indexOf("application-label:") === 0) {
            info.applicationLabel = line.substring(19, line.length - 2)
          } else if (line.indexOf("application-label-zh-CN:") === 0) {
            info.applicationLabel = line.substring(25, line.length - 2)
          }
        })
        info.apkPath = path.trim()
        result2.apkInfo = info
        resolve(result2)
      })
    })
  })
}

function disableApp(deviceId, packageName) {
  return new Promise((resolve, reject) => {
    exec(["adb -s " + deviceId + " shell pm disable-user --user 0 " + packageName]).then(result => {
      resolve(result)
    })
  })
}

function batchDisableApp(deviceId, packageNames) {
  return new Promise((resolve, reject) => {
    exec(
      packageNames.map(packageName => {
        return "adb -s " + deviceId + " shell pm disable-user --user 0 " + packageName
      })
    ).then(result => {
      resolve(result)
    })
  })
}

function enableApp(deviceId, packageName) {
  return new Promise((resolve, reject) => {
    exec(["adb -s " + deviceId + " shell pm enable " + packageName]).then(result => {
      resolve(result)
    })
  })
}

function batchEnableApp(deviceId, packageNames) {
  return new Promise((resolve, reject) => {
    exec(
      packageNames.map(packageName => {
        return "adb -s " + deviceId + " shell pm enable " + packageName
      })
    ).then(result => {
      resolve(result)
    })
  })
}

function uninstallApp(deviceId, packageName) {
  return new Promise((resolve, reject) => {
    exec(["adb -s " + deviceId + " shell pm uninstall --user 0 " + packageName]).then(result => {
      resolve(result)
    })
  })
}

function batchUninstallApp(deviceId, packageNames) {
  return new Promise((resolve, reject) => {
    exec(
      packageNames.map(packageName => {
        return "adb -s " + deviceId + " shell pm uninstall --user 0 " + packageName
      })
    ).then(result => {
      resolve(result)
    })
  })
}

function installApp(deviceId, apkPath, appName) {
  return new Promise((resolve, reject) => {
    let tempStart = "adb -s " + deviceId + " "
    exec([tempStart + ' install -r "' + apkPath + '"']).then(result => {
      resolve(result)
    })
  })
}

function pullApp(deviceId, packageName, apkPath = "", appName, versionName = "") {
  let homedir = window.require("os").homedir()
  cpExec(
    "md " + '"' + window.require("path").join(homedir, "Desktop", "apk") + '"',
    {},
    (error, stdout, stderr) => {}
  )

  let tempStart = "adb -s " + deviceId + " "
  let fileName = (appName ? appName + "_" + packageName : packageName) + "_" + versionName + ".apk"
  let savePath = '"' + window.require("path").join(homedir, "Desktop", "apk", fileName) + '"'

  if (apkPath) {
    return new Promise((resolve, reject) => {
      exec([tempStart + " pull " + apkPath.trim() + " " + savePath]).then(result => {
        // console.log(result)
        resolve(result)
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      exec([tempStart + "shell pm path " + packageName]).then(result => {
        let path = result.stdout
          .substr(8)
          .trim()
          .split("\n")[0]
        exec([tempStart + " pull " + path + " " + savePath]).then(result => {
          resolve(result)
        })
      })
    })
  }
}

async function batchPullApp(deviceId, list, failedCallBack = undefined) {
  let homedir = window.require("os").homedir()
  cpExec(
    "md " + '"' + window.require("path").join(homedir, "Desktop", "apk") + '"',
    {},
    (error, stdout, stderr) => {}
  )
  let totalCount = list.length
  let tempStart = "adb -s " + deviceId + " "
  let newList = Object.assign([], list)
  let failedList = []
  for (let i = 0; i < newList.length; i++) {
    let item = newList[i]
    item.fileName =
      (item.applicationLabel ? item.applicationLabel + "_" + item.packageName : item.packageName) +
      "_" +
      item.versionName +
      ".apk"
    if (!item.apkPath) {
      await exec([tempStart + "shell pm path " + item.packageName]).then(result => {
        item.apkPath = result.stdout
          .substr(8)
          .trim()
          .split("\n")[0]
      })
    }
  }
  return new Promise((resolve, reject) => {
    return Promise.all(
      newList.map(item => {
        return exec([
          tempStart +
            " pull " +
            item.apkPath +
            " " +
            '"' +
            window.require("path").join(homedir, "Desktop", "apk", item.fileName) +
            '"',
        ])
      })
    )
      .then(result => {
        resolve({
          stdout: result
            .map(ret => {
              return ret.stdout
            })
            .join(";"),
          stderr: result
            .filter(ret => {
              return !!ret.stderr
            })
            .map(ret => {
              return ret.stderr
            })
            .join(";"),
        })
      })
      .catch(error => {
        reject(error)
      })
  })
}

module.exports = {
  getAdbVersion,
  initAAPT,
  getDeviceList,
  getPackages,
  getApkInfo,
  disableApp,
  enableApp,
  uninstallApp,
  batchDisableApp,
  batchEnableApp,
  batchUninstallApp,
  installApp,
  pullApp,
  batchPullApp,
}
