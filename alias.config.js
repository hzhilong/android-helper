const resolve = dir => require("path").join(__dirname, dir)

module.exports = {
  resolve: {
    alias: {
      "@": resolve("src"),
      assets: resolve("src/assets"),
      comp: resolve("src/comp"),
      views: resolve("src/views"),
      utils: resolve("src/utils"),
    },
  },
}
