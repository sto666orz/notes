<template>
  <transition name="fade">
    <div v-show="visible" class="container" :class="theme">
      <div class="popup-content">
        <button class="button share" @click="shareTo()"></button>
        <button
          class="button lottery"
          @click="linkTo('/musicParty/lottery')"
        ></button>
      </div>
    </div>
  </transition>
</template>

<script>
import { Notify } from 'vant';

export default {
  props: {
    visible: Boolean,
    theme: String,
  },
  emits: ['update:visible', 'share'],
  setup(props, context) {
    const shareTo = () => {
      // context.emit('share');
      Notify({message: '分享需要公众号，所以没办法用。分享后的助力页面正在改造中....'});
    }

    const linkTo = (path) => {
      Notify({message: '功能改造中....'});
      // console.log('linkTo', path);
      /* this.$router.push({
        path: path,
        query: this.$route.query,
      }); */
    }

    return {
      shareTo,
      linkTo,
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;

  .popup-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100%;
  }

  .button {
    display: block;
    width: 640px;
    height: 102px;
    border-radius: 54px;
    border: 5px solid #7f283a;
    &.share {
      background: #fe5535
        url("../../../assets/images/musicParty2020/stage/type_share@2x.png") center
        center no-repeat;
      background-size: 282px;
    }
    &.lottery {
      background: #ffdc01
        url("../../../assets/images/musicParty2020/stage/type_choujiang@2x.png")
        center center no-repeat;
      background-size: 114px;
    }
    & + .button {
      margin-top: 26px;
    }
  }

  &.christmas {
    background-color: #b5681e;
  }
  &.newyear {
    background-color: #ffceb4;
  }
}

// 打开/关闭动画
.fade-enter-active,
.fade-leave-active {
  transition: transform 0.33s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  transform: translateY(100%);
}
</style>