<template>
  <ul class="ins-list" :class="label">
    <li v-for="(name, index) in imagesList" class="ins-item" :key="name">
      <img
        class="ins-gray"
        :src="
          import(`../../../assets/images/musicParty2020/stage/ins_${name}@2x.png`)
        "
      />
      <img
        v-show="!exclude.some((item) => item === name)"
        :src="
          import(`../../../assets/images/musicParty2020/stage/ins_${name}@2x.png`)
        "
        @touchstart="touchStart(index, $event)"
        @touchmove="touchMove(index, $event)"
        @touchend="touchEnd(index, $event)"
        :style="transformStyle(index)"
        class="ins-move"
      />
      <img
        class="ins-cover"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAABeAgMAAAA7yS7rAAAACVBMVEUAAADCch/8smh9bw39AAAAAXRSTlMAQObYZgAAAB5JREFUKM9jEA2FAIdR1ohhaa2CgAbqsAaBj0YECwB5CQ8AsZsPlQAAAABJRU5ErkJggg=="
      />
    </li>
  </ul>
</template>

<script>
import { reactive, computed } from 'vue';
import insConfig from "../local/insConfig";

export default {
  props: {
    // first | second
    label: String,
    // 排除列表
    exclude: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['movestart', 'moveing', 'moveend'],
  setup(props, context) {
      /** @type {String[]} */
    const labels = insConfig[props.label];
    const itemList = reactive(labels.map(() => {
      return {
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
        isMove: false
      }
    }) );
    const imagesList = computed(() => {
      const label = props.label;
      return insConfig[label] ? insConfig[label] : [];
    });

    const transformStyle = (index) => {
      if (index >= itemList.length) {
        return null;
      }
      const item = itemList[index];
      return `transform: translate(${item.x}px, ${item.y}px); ${
        item.isMove ? "transition-duration: 0s; z-index: 5" : ""
      }`;
    }

    /**
     * @param {Number} index
     * @param {TouchEvent} event
     */
    const touchStart = (index, event) => {
      const item = itemList[index];
      const touches = event.targetTouches[0];
      item.startX = touches.clientX;
      item.startY = touches.clientY;
      item.isMove = true;
      context.emit('movestart', imagesList[index], touches.clientX, touches.clientY);
    }

    /**
     * @param {Number} index
     * @param {TouchEvent} event
     */
    const touchMove = (index, event) => {
      // ios部分机型 弹性滚动坐标错误bug 所以阻止事件传递
      event.preventDefault();
      const item = itemList[index];
      const touches = event.targetTouches[0];
      item.x = touches.clientX - item.startX;
      item.y = touches.clientY - item.startY;
      context.emit('moveing', imagesList[index], touches.clientX, touches.clientY);
    }

    /**
     * @param {Number} index
     * @param {TouchEvent} event
     */
    const touchEnd = (index, event) => {
      const item = itemList[index];
      item.isMove = false;
      item.x = 0;
      item.y = 0;
      context.emit('moveend', imagesList[index]);
    }

    return {
      imagesList,
      transformStyle,
      touchStart,
      touchMove,
      touchEnd,
    }
  }
}
</script>

<style lang="scss" scoped>
.ins-list {
  display: flex;
  justify-content: space-between;
  width: 684px;
  // margin: 0 auto;
  .ins-item {
    $itemWidth: 124px;
    $itemHeight: 106px;
    position: relative;
    width: $itemWidth;
    height: $itemHeight;
    .ins-gray,
    .ins-move {
      position: absolute;
      top: 0;
      left: 0;
      width: $itemWidth;
      height: $itemHeight;
    }
    .ins-gray {
      filter: grayscale(1);
      opacity: 0.5;
    }
    .ins-move {
      transition-property: transform;
      transition-duration: 0.25s;
      transition-timing-function: linear;
    }
    .ins-cover {
      position: absolute;
      top: -38px;
      left: 50%;
      transform: translateX(-50%);
      width: 17px;
      height: 47px;
    }
  }
}
</style>