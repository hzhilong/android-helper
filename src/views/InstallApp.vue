<template>
  <Upload
    class="upload-container"
    type="drag"
    action="test"
    :format="['apk']"
    :beforeUpload="onBeforeUpload"
  >
    <div style="padding: 20px">
      <Icon type="ios-cloud-upload" size="66" style="color: #3399ff"></Icon>
      <p style="font-size: 18px;">点击或将文件拖拽到这里上传</p>
    </div>
    <p style="color: green;">
      【使用说明】：请先在开发者模式中开启'usb安装'的功能。
      <br />
      并在第一次安装应用时在手机上授权[始终允许安装]。
    </p>
    <p style="color: red;">
      <br />
      {{ uploadResult }}
    </p>
  </Upload>
</template>

<script>
  import AdbUtil from "utils/adb-util"

  export default {
    name: "InstallApp",
    data() {
      return {
        deviceId: "",
        uploadResult: "",
      }
    },
    mounted() {
      this.deviceId = this.$route.query.deviceId
    },
    methods: {
      onBeforeUpload(file) {
        let _this = this
        console.log(file)
        if (!this.deviceId) {
          window._message("未选择设备", "error")
          return
        }
        if (file.name.lastIndexOf(".apk") !== file.name.length - 4) {
          window._message("格式错误，请选择apk文件", "error")
          return
        }

        _this.$loading.show("请稍候")
        AdbUtil.installApp(this.deviceId, file.path, file.name)
          .then(result => {
            console.log("【上传结果1】", result)
            _this.$loading.hide()
            _this.uploadResult = `[${file.name}]上传结果:
            ${result.stderr ? result.stderr : result.stdout}`
          })
          .catch(e => {
            console.log("【上传结果2】", e)
            _this.$loading.hide()
          })
        return false
      },
    },
  }
</script>

<style lang="scss">
  .upload-container {
    height: 100%;
    width: 100%;

    .ivu-upload {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
  }
</style>
