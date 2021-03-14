<template>
  <transition name="fade">
    <div v-show="visible" class="popup-bg">
      <div class="popup-content" :style="{ width: width, height: height }">
        <slot></slot>
        <i class="button-close" :class="placement" @click="closeView()"></i>
      </div>
    </div>
  </transition>
</template>

<script>
import { watch, nextTick } from 'vue'

export default {
  props: {
    visible: Boolean,
    // 关闭按钮位置 默认右上角
    placement: {
      type: String,
      default: "right",
    },
    width: String, // 非必选 宽度
    height: String, // 非必选 高度
  },
  emits: ['close', 'open', 'update:visible'],
  setup(props, context) {

    const closeView = () => {
      context.emit('update:visible', false);
      context.emit('close', null);
    }

    watch(() => props.visible, (val, oldVal) => {
      if (val) {
        nextTick().then(() => {
          context.emit('open', null);
        });
      }
    }, {
      immediate: true
    });

    return {
      closeView,
    }
  }
};
</script>

<style lang="scss" scoped>
.popup-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;

  background-color: rgba(0, 0, 0, 0.75);
  z-index: 99;
  .popup-content {
    position: relative;
    margin: -25px auto 0; // 稍微偏上一点 看起来更和谐
    border-radius: 26px;
    background-color: #ffffff;

    .button-close {
      position: absolute;
      width: 70px;
      height: 70px;
      background: url("./icon_close@2x.png") 0 0 no-repeat;
      background-size: 100%;
      &.right {
        top: -90px;
        right: 0;
      }
      &.bottom {
        left: 50%;
        transform: translateX(-50%);
        bottom: -90px;
      }
    }
  }
}

// 打开/关闭动画
.fade-enter-active,
.fade-leave-active {
  transition: background 0.3s linear;
  .popup-content {
    transition: all 0.27s ease-in-out;
  }
}
.fade-enter-from,
.fade-leave-to {
  background-color: rgba(0, 0, 0, 0);
  .popup-content {
    transform: scale(0.8, 0.8);
    opacity: 0;
  }
}
</style>
