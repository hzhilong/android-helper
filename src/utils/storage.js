export default {
  getItem(key) {
    if (!key) return
    let value = window.localStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (e) {
      return value
    }
  },
  setItem(key, value) {
    if (!key) return
    window.localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key) {
    if (!key) return
    return window.localStorage.removeItem(key)
  },
}
