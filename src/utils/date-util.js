export default {
  formatNow(format = "yyyy-MM-dd hh:mm:ss") {
    return this.format(new Date(), format)
  },
  format(date, format) {
    var o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds(),
    }

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
      }
    }
    return format
  },
  getDay(day) {
    var today = new Date()

    var milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day

    today.setTime(milliseconds)

    var tMonth = today.getMonth()
    var tDate = today.getDate()
    tMonth = this.doHandleMonth(tMonth + 1)
    tDate = this.doHandleMonth(tDate)
    return tMonth + "-" + tDate
  },

  getMonth() {
    var today = new Date()

    var milliseconds = today.getTime()

    today.setTime(milliseconds)

    var tYear = today.getFullYear()
    var tMonth = today.getMonth()
    tMonth = this.doHandleMonth(tMonth + 1)
    return tYear + "-" + tMonth
  },
  doHandleMonth(month) {
    var m = month
    if (month.toString().length == 1) {
      m = "0" + month
    }
    return m
  },
}
