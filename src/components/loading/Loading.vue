<template lang="html">
  <div v-if="isShowLoading" class="loading-container" @click="cancel">
    <div class="loading-box">
      <div class="loading-anim">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span class="loading-txt">{{ content }}</span>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isShowLoading: false,
        maskCloseAble: false,
        onCancel: null,
        content: "",
      }
    },
    methods: {
      cancel() {
        if (this.maskCloseAble) {
          this.isShowLoading = false
          if (this.onCancel) {
            this.onCancel()
            this.onCancel = null
          }
        }
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    z-index: 1000;
  }

  @media (max-width: 1200px) {
    .loading-container {
      background: #17171740;
    }
  }

  .loading-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    background: #494949;
    padding: 10px 20px;
    box-shadow: 4px 4px 7px #bfbfbf;
    color: #fff;
  }

  .loading-anim {
    height: 40px;
    display: flex;
    align-items: center;
  }

  .loading-anim span {
    display: inline-block;
    border-radius: 5px;
    background: #949090;

    $total: 5;
    $span: 2px;
    $totalSpan: 20px;
    $sec: 1.5s;

    @mixin anim-item($index: 1) {
      -webkit-animation: load-#{$index} #{$sec} ease infinite;
    }

    @for $i from 1 through $total {
      &:nth-child(#{$i}) {
        @include anim-item(#{6-$i});
      }
      @keyframes load-#{$i} {
        $padding1: $span * $i;
        $margin1: $totalSpan - $span * $i;
        $percentageTotal: 2 * $total;
        0% {
          padding: $padding1;
          margin: $margin1;
          border-radius: $padding1;
        }
        @if $total == $i {
          50% {
            padding: $span;
            margin: $totalSpan - $span;
            border-radius: $span;
          }
          100% {
            padding: $padding1;
            margin: $margin1;
            border-radius: $padding1;
          }
        } @else {
          #{percentage($total - $i +1)/$percentageTotal} {
            padding: $total * $span;
            margin: $totalSpan - $span * $total;
            border-radius: $total * $span;
          }
          #{percentage($total - $i +6)/$percentageTotal} {
            padding: $span;
            margin: $totalSpan - $span;
            border-radius: $span;
          }
        }
        @if (1 < $i and $i < $total) {
          100% {
            padding: $padding1;
            margin: $margin1;
            border-radius: $padding1;
          }
        }
      }
    }
  }

  .loading-txt {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #fff;
  }
</style>
