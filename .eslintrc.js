module.exports = {
  root: true,
  env: {
    node: true,
    jquery: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  globals: {
    localStorage: true,
    window: true,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/script-indent": ["error", 2, { baseIndent: 1 }],
    // 禁用引号检查	引号类型 `` "" ''
    quotes: [0, "prefer-double"],
    // 禁用分号检查	[1, "always"]: 需要分号, [2, "never"]: 不加分号, 0: 禁用此项
    semi: [2, "never"],
    // 禁止出现空代码块，允许 catch 为空代码块
    "no-empty": [
      "error",
      {
        allowEmptyCatch: true,
      },
    ],
    "no-empty": "off",
    "no-empty-function": "off",
    // prettier
    "prettier/prettier": [
      "error",
      {
        /* 一行的字符数，如果超过会进行换行，默认为80 */
        printWidth: 100,
        /* 单引号包含字符串 */
        singleQuote: false,
        /* 不添加末尾分号 */
        semi: false,
        /* 在对象属性添加空格 */
        bracketSpacing: true,
        /* 优化html闭合标签不换行的问题 */
        htmlWhitespaceSensitivity: "ignore",
        jsxBracketSameLine: true,
        /* 是否使用尾逗号，可选值"<none|es5|all>"，默认none */
        trailingComma: "es5",
        /* <script>和<style>标签缩进 */
        vueIndentScriptAndStyle: true,
      },
    ],
    // 验证标签end
    "vue/no-parsing-error": [
      2,
      {
        "x-invalid-end-tag": false,
      },
    ],
    "vue/html-self-closing": "off",
    "no-unused-vars": "off",
    "no-unreachable": "off",
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        indent: "off",
      },
    },
  ],
}
