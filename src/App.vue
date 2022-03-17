<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "App",
    components: {},
    data() {
      return {}
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {},
  }
</script>

<style>
  @import "assets/iconfont/iconfont.css";
</style>
<style lang="scss">
  html,
  body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  #app {
    width: 100%;
    height: 100%;
    background: #fff;
    font-size: 12px;
    color: #5a5f5b;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  @import "assets/css/common";
</style>
