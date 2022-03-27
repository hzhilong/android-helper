<template>
  <div class="page-container">
    <div class="no-device-container" v-if="!deviceId">
      <div class="iconfont icon-device-offline"></div>
      <div>请选择设备</div>
    </div>
    <template v-else>
      <Tabs v-model="tabIndex">
        <TabPane label="用户已安装应用" name="1">
          <div class="tab-pane-content">
            <Table
              :ref="refPageTable1"
              :columns="tableColumns1"
              :data="tableData1"
              :maxHeight="tableMaxHeight"
            ></Table>
          </div>
        </TabPane>
        <TabPane label="系统应用" name="2">
          <div class="tab-pane-content">
            <Table
              :ref="refPageTable2"
              :columns="tableColumns2"
              :data="tableData2"
              :maxHeight="tableMaxHeight"
            ></Table>
          </div>
        </TabPane>
        <TabPane label="已冻结应用" name="3">
          <div class="tab-pane-content">
            <Table
              :ref="refPageTable3"
              :columns="tableColumns3"
              :data="tableData3"
              :maxHeight="tableMaxHeight"
            ></Table>
          </div>
        </TabPane>
        <Input
          slot="extra"
          size="small"
          v-model="searchContent"
          placeholder="查找"
          style="width: 100px;"
          clearable
          search
          @on-search="searchApp"
        />
        <Button size="small" slot="extra" @click="refreshPage" style="margin-left: 10px">
          刷新
        </Button>
        <Button size="small" slot="extra" @click="batchUninstallApp" style="margin-left: 10px">
          卸载
        </Button>
        <Button
          v-if="tabIndex !== '3'"
          size="small"
          slot="extra"
          @click="batchDisableApp"
          style="margin-left: 10px"
        >
          冻结
        </Button>
        <Button
          v-if="tabIndex === '3'"
          size="small"
          slot="extra"
          @click="batchEnableApp"
          style="margin-left: 10px"
        >
          启用
        </Button>
        <Button size="small" slot="extra" @click="batchPullApp" style="margin-left: 10px">
          导出
        </Button>
      </Tabs>
    </template>
  </div>
</template>

<script>
  import AdbUtil from "utils/adb-util"
  import StorageUtil from "utils/storage"
  import axios from "axios"

  export default {
    name: "AppManagement",
    data() {
      let _this = this
      const renderOptionBtn = (h, text, callback) => {
        return h(
          "span",
          {
            class: "option-btn",
            on: {
              click: callback,
            },
          },
          text
        )
      }

      return {
        deviceId: "",
        tabIndex: "1",

        tableMaxHeight: 500,
        refPageTable1: "r1" + new Date().getTime(),
        tableColumns1: [
          {
            type: "selection",
            title: "选择",
            width: 56,
            align: "center",
          },
          {
            title: "应用名称",
            key: "applicationLabel",
            align: "center",
          },
          {
            title: "包名",
            key: "packageName",
            align: "center",
          },
          {
            title: "版本号",
            key: "versionName",
            width: 120,
            align: "center",
          },
          {
            title: "操作",
            width: 150,
            key: "address",
            align: "center",
            render: (h, params) => {
              const row = params.row
              return [
                renderOptionBtn(h, "卸载", () => {
                  window._confirm("确定卸载吗", () => {
                    AdbUtil.uninstallApp(_this.deviceId, row.packageName).then(result => {
                      _this.handleResultMsg(result)
                      _this.refreshPage()
                    })
                  })
                }),
                renderOptionBtn(h, "冻结", () => {
                  window._confirm("确定冻结吗", () => {
                    AdbUtil.disableApp(_this.deviceId, row.packageName).then(result => {
                      _this.handleResultMsg(result)
                      _this.refreshPage()
                    })
                  })
                }),
                renderOptionBtn(h, "导出", () => {
                  _this.$loading.show("请稍候")
                  AdbUtil.pullApp(
                    _this.deviceId,
                    row.packageName,
                    row.apkPath,
                    row.applicationLabel,
                    row.versionName
                  ).then(result => {
                    _this.$loading.hide()
                    if (_this.handleResultMsg(result)) {
                      window._message("已导出到[桌面/apk/]目录下")
                    }
                  })
                }),
              ]
            },
          },
        ],
        tableData1: [],

        refPageTable2: "r2" + new Date().getTime(),
        tableColumns2: [
          {
            type: "selection",
            title: "选择",
            width: 56,
            align: "center",
          },
          {
            title: "应用名称",
            key: "applicationLabel",
            align: "center",
          },
          {
            title: "包名",
            key: "packageName",
            align: "center",
          },
          {
            title: "版本号",
            key: "versionName",
            width: 120,
            align: "center",
          },
          {
            title: "操作",
            width: 150,
            key: "address",
            align: "center",
            render: (h, params) => {
              const row = params.row
              return [
                renderOptionBtn(h, "卸载", () => {
                  window._confirm("确定卸载吗", () => {
                    AdbUtil.uninstallApp(_this.deviceId, row.packageName).then(result => {
                      _this.handleResultMsg(result)
                      _this.refreshPage()
                    })
                  })
                }),
                renderOptionBtn(h, "冻结", () => {
                  window._confirm("确定冻结吗", () => {
                    AdbUtil.disableApp(_this.deviceId, row.packageName).then(result => {
                      _this.handleResultMsg(result)
                      _this.refreshPage()
                    })
                  })
                }),
                renderOptionBtn(h, "导出", () => {
                  _this.$loading.show("请稍候")
                  AdbUtil.pullApp(
                    _this.deviceId,
                    row.packageName,
                    row.apkPath,
                    row.applicationLabel,
                    row.versionName
                  ).then(result => {
                    _this.$loading.hide()
                    if (_this.handleResultMsg(result)) {
                      window._message("已导出到[桌面/apk/]目录下")
                    }
                  })
                }),
              ]
            },
          },
        ],
        tableData2: [],

        refPageTable3: "r3" + new Date().getTime(),
        tableColumns3: [
          {
            type: "selection",
            title: "选择",
            width: 56,
            align: "center",
          },
          {
            title: "应用名称",
            key: "applicationLabel",
            align: "center",
          },
          {
            title: "包名",
            key: "packageName",
            align: "center",
          },
          {
            title: "版本号",
            key: "versionName",
            width: 120,
            align: "center",
          },
          {
            title: "操作",
            width: 150,
            key: "address",
            align: "center",
            render: (h, params) => {
              const row = params.row
              return [
                renderOptionBtn(h, "卸载", () => {
                  window._confirm("确定卸载吗", () => {
                    AdbUtil.uninstallApp(_this.deviceId, row.packageName).then(result => {
                      _this.handleResultMsg(result)
                      _this.refreshPage()
                    })
                  })
                }),
                renderOptionBtn(h, "启用", () => {
                  window._confirm("确定启用吗", () => {
                    AdbUtil.enableApp(_this.deviceId, row.packageName).then(result => {
                      _this.handleResultMsg(result)
                      _this.refreshPage()
                    })
                  })
                }),
                renderOptionBtn(h, "导出", () => {
                  _this.$loading.show("请稍候")
                  AdbUtil.pullApp(
                    _this.deviceId,
                    row.packageName,
                    row.apkPath,
                    row.applicationLabel,
                    row.versionName
                  ).then(result => {
                    _this.$loading.hide()
                    if (_this.handleResultMsg(result)) {
                      window._message("已导出到[桌面/apk/]目录下")
                    }
                  })
                }),
              ]
            },
          },
        ],
        tableData3: [],

        searchContent: "",
        savedApksData: {},
        getApkInfoCompleted: false,
        tableData: [],
      }
    },
    watch: {
      deviceId(newValue, oldValue) {},
      tabIndex(newValue, oldValue) {
        this.saveApkInfo()
        this.refreshPage()
      },
    },
    created() {},
    mounted() {
      this.deviceId = this.$route.query.deviceId
      this.savedApksData = StorageUtil.getItem("savedApksData-" + this.deviceId)
      if (!this.savedApksData) {
        this.savedApksData = {}
      }
      this.$nextTick(() => {
        this.refreshPage()
      })
    },
    beforeDestroy() {
      this.saveApkInfo()
      this.tabIndex = 4
    },
    destroyed() {},
    methods: {
      saveApkInfo() {
        if (this.savedApksData) {
          StorageUtil.setItem("savedApksData-" + this.deviceId, this.savedApksData)
        }
      },
      handleResultMsg(result) {
        if (result.stderr) {
          window._modal(result.stderr)
          return false
        }
        if (result.stdout.startsWith("adb: error")) {
          window._modal(result.stdout)
          return false
        }
        return true
      },
      refreshPage() {
        let _this = this
        if (!this.deviceId) {
          return
        }
        _this.searchContent = ""
        _this.getApkInfoCompleted = false
        _this.$loading.show("请稍候")
        let currTabIndex = this.tabIndex
        _this.tableData1 = _this.tableData2 = _this.tableData3 = []
        let params
        if (this.tabIndex === "1") {
          params = "-3 -e"
        } else if (this.tabIndex === "2") {
          params = "-s -e"
        } else if (this.tabIndex === "3") {
          params = "-d"
        }
        AdbUtil.getPackages(this.deviceId, params)
          .then(async function(result) {
            if (!_this.handleResultMsg(result)) {
              _this.$loading.hide()
              return
            }
            let list = []
            let noAppInfoIndexes = []
            for (let i = 0; i < result.packages.length; i++) {
              let packageName = result.packages[i]
              if (_this.savedApksData[packageName] === undefined) {
                noAppInfoIndexes.push(i)
                list.push({
                  packageName: packageName,
                })
              } else {
                list.push(_this.savedApksData[packageName])
              }
            }
            if (_this.tabIndex === "1") {
              _this.tableData1 = list
            } else if (_this.tabIndex === "2") {
              _this.tableData2 = list
            } else if (_this.tabIndex === "3") {
              _this.tableData3 = list
            }
            _this.tableData = list
            _this.$loading.hide()
            if (noAppInfoIndexes.length > 0) {
              _this.getApkInfoCompleted = false
              for (let i = 0; i < noAppInfoIndexes.length; i++) {
                if (currTabIndex !== _this.tabIndex) {
                  break
                }
                await _this.getApkInfo(
                  list[noAppInfoIndexes[i]].packageName,
                  currTabIndex,
                  noAppInfoIndexes[i]
                )
              }
              _this.getApkInfoCompleted = true
            } else {
              _this.getApkInfoCompleted = true
            }
          })
          .catch(e => {
            _this.$loading.hide()
          })
      },
      async getApkInfo(packageName, currTabIndex, index) {
        if (this.savedApksData[packageName] !== undefined) {
          return
        }
        await AdbUtil.getApkInfo(this.deviceId, packageName).then(result => {
          if (result.apkInfo) {
            this.savedApksData[packageName] = result.apkInfo
            if (currTabIndex !== this.tabIndex) {
              return
            }
            if (currTabIndex === "1") {
              if (this.tableData1[index] && this.tableData1[index].packageName === packageName) {
                Object.assign(this.tableData1[index], result.apkInfo)
                this.$set(this.tableData1, index, this.tableData1[index])
              }
            } else if (currTabIndex === "2") {
              if (this.tableData2[index] && this.tableData2[index].packageName === packageName) {
                Object.assign(this.tableData2[index], result.apkInfo)
                this.$set(this.tableData2, index, this.tableData2[index])
              }
            } else if (currTabIndex === "3") {
              if (this.tableData3[index] && this.tableData3[index].packageName === packageName) {
                Object.assign(this.tableData3[index], result.apkInfo)
                this.$set(this.tableData3, index, this.tableData3[index])
              }
            }
          }
        })
      },
      getTableSelection() {
        if (this.tabIndex === "1") {
          return this.$refs[this.refPageTable1].getSelection()
        } else if (this.tabIndex === "2") {
          return this.$refs[this.refPageTable2].getSelection()
        } else if (this.tabIndex === "3") {
          return this.$refs[this.refPageTable3].getSelection()
        }
      },
      batchEnableApp() {
        let _this = this
        let tableSelection = this.getTableSelection()
        if (!tableSelection || tableSelection.length === 0) {
          window._message("未选择数据", "error")
          return
        }
        _this.$loading.show("请稍候")
        AdbUtil.batchEnableApp(
          this.deviceId,
          tableSelection.map(item => {
            return item.packageName
          })
        )
          .then(result => {
            _this.handleResultMsg(result)
            _this.refreshPage()
            _this.$loading.hide()
          })
          .catch(e => {
            _this.$loading.hide()
          })
      },
      batchDisableApp() {
        let _this = this
        let tableSelection = this.getTableSelection()
        if (!tableSelection || tableSelection.length === 0) {
          window._message("未选择数据", "error")
          return
        }
        _this.$loading.show("请稍候")
        AdbUtil.batchDisableApp(
          this.deviceId,
          tableSelection.map(item => {
            return item.packageName
          })
        )
          .then(result => {
            _this.handleResultMsg(result)
            _this.refreshPage()
            _this.$loading.hide()
          })
          .catch(e => {
            _this.$loading.hide()
          })
      },
      batchUninstallApp() {
        let _this = this
        let tableSelection = this.getTableSelection()
        if (!tableSelection || tableSelection.length === 0) {
          window._message("未选择数据", "error")
          return
        }
        _this.$loading.show("请稍候")
        AdbUtil.batchUninstallApp(
          this.deviceId,
          tableSelection.map(item => {
            return item.packageName
          })
        )
          .then(result => {
            _this.handleResultMsg(result)
            _this.refreshPage()
            _this.$loading.hide()
          })
          .catch(e => {
            _this.$loading.hide()
          })
      },
      batchPullApp() {
        let _this = this
        let tableSelection = this.getTableSelection()
        if (!tableSelection || tableSelection.length === 0) {
          window._message("未选择数据", "error")
          return
        }
        _this.$loading.show("请稍候")
        AdbUtil.batchPullApp(this.deviceId, tableSelection)
          .then(result => {
            if (_this.handleResultMsg(result)) {
              window._message("已导出到[桌面/apk/]目录下（部分数据过大可能延迟）")
            }
            _this.$loading.hide()
          })
          .catch(e => {
            _this.$loading.hide()
          })
      },
      searchApp() {
        if (!this.deviceId) {
          return
        }
        if (!this.getApkInfoCompleted) {
          window._message("获取所有APP信息中，请稍等")
          return
        }
        let list = JSON.parse(JSON.stringify(this.tableData))
        let newList = []
        if (!this.searchContent) {
          newList = list
        } else {
          if (list && list.length > 0) {
            list.forEach(item => {
              if (
                (item.applicationLabel && item.applicationLabel.indexOf(this.searchContent) >= 0) ||
                (item.packageName && item.packageName.indexOf(this.searchContent) >= 0)
              ) {
                newList.push(Object.assign({}, item))
              }
            })
          }
        }
        if (this.tabIndex === "1") {
          this.$set(this, "tableData1", newList)
        } else if (this.tabIndex === "2") {
          this.$set(this, "tableData2", newList)
        } else if (this.tabIndex === "3") {
          this.$set(this, "tableData3", newList)
        }
      },
    },
  }
</script>

<style scoped lang="scss">
  @import "../assets/css/app-manage";
</style>
