<template>
  <div v-show="visible" :class="['boy', `boy-${index}`]">
    <div
      :class="['animation', hit ? 'is-hit' : null, skin ? skin : 'empty']"
    ></div>
    <div @touchstart="touchStart" @touchmove="touchMove">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    index: Number, // 编号
    hit: Boolean, // 是否碰撞(样式)
    skin: String, // 皮肤
    visible: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['slideDown'],
  setup(props, context) {
    const startX = ref(0);
    const startY = ref(0);
    /** @param {TouchEvent} event */
    const touchStart = event => {
      if (!props.skin) return;
      const touches = event.targetTouches[0];
      startX.value = touches.clientX;
      startY.value = touches.clientY;
    }
    /** @param {TouchEvent} event */
    const touchMove = event => {
      if (!props.skin) return;
      const touches = event.targetTouches[0];
      if (
        touches.clientX - startX.value <= 20 &&
        touches.clientY - startY.value >= 30
      ) {
        context.emit("slideDown");
      }
    }
    return {
      touchStart,
      touchMove,
    }
  }
};
</script>

<style src="../public/animation.css">
</style>

<style lang="scss" scoped>
.boy {
  position: absolute;
  width: 230px;
  height: 330px;

  .is-hit {
    opacity: 0.7;
  }

  &.boy-1 {
    top: 235px;
    left: 60px;
  }
  &.boy-2 {
    top: 235px;
    left: 260px;
  }
  &.boy-3 {
    top: 235px;
    right: 60px;
  }
  &.boy-4 {
    top: 535px;
    left: 60px;
  }
  &.boy-5 {
    top: 535px;
    right: 60px;
  }

  &.boy-0 {
    top: 535px;
    left: 260px;
  }
}
</style>