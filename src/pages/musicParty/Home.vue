<template>
  <div class="page-wrap">
    <span class="button-start" @click="switchStage(true)"></span>
    <span class="sound-tips"></span>
    <transition name="fade">
      <div
        v-if="stageVisible"
        class="to-bg"
        @click.self="switchStage(false)"
      >
        <img
          class="select-party"
          src="../../assets/images/musicParty2020/pic_choose@2x.png"
        />
        <div class="container" @click.self="switchStage(false)">
          <i
            class="to-stage left"
            :class="getStyle('christmas')"
            @click="toStage('christmas')"
          ></i>
          <i
            class="to-stage right"
            :class="getStyle('newyear')"
            @click="toStage('newyear')"
          ></i>
        </div>
      </div>
    </transition>
    <p class="preload"></p>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  setup(props) {
    let stageVisible = ref(false);

    let currentStage = ref('');

    const getStyle = (tag) => {
      const activated = currentStage.value === tag;
      const deactivated = currentStage.value !== '' && !activated;
      return { activated, deactivated }
    }

    const switchStage = (toogle) => {
      stageVisible.value = toogle;
    }

    const router = useRouter();
    const route = useRoute();

    const toStage = (theme) => {
      if (!currentStage.value) {
        currentStage.value = theme;

        setTimeout(() => {
          router.push({
            path: "/musicParty/party",
            query: { ...route.query, theme: theme },
          });
        }, 400);
      }
    }

    return {
      stageVisible,
      switchStage,
      toStage,
      getStyle
    }
  }
}
</script>

<style lang="scss" scoped>

@keyframes breath {
  0%, 25%, 50%, 100% {
    transform: scale(1, 1);
  }
  12.5%, 37.5% {
    transform: scale(1.1, 1.1);
  }
}

@keyframes sounds {
  0%,
  50%,
  100% {
    opacity: 1;
  }
  75% {
    opacity: 0.33;
  }
}

.page-wrap {
  position: relative;
  height: 100%;
  background: url("../../assets/images/musicParty2020/pic_zhutu@2x.jpg") center center no-repeat;
  background-size: cover;

  .button-start {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 239px;
    width: 565px;
    height: 115px;
    margin: 0 auto;
    background: url("../../assets/images/musicParty2020/ico_start@2x.png") 0 0 no-repeat;
    background-size: 100%;
    border-radius: 54px;
    // animation: breath 0.5s ease-in-out infinite alternate;
    animation: breath 2s ease-in-out infinite;
  }

  .sound-tips {
    position: absolute;
    left: 50%;
    bottom: 142px;
    transform: translateX(-50%);
    width: 277px;
    height: 40px;
    background: url("../../assets/images/musicParty2020/type@2x.png") 0 0 no-repeat;
    background-size: 100%;
    animation: sounds 4s ease-in-out infinite;
  }
}

.preload {
  position: fixed;
  top: -999px;
  left: -999px;
  width: 1px;
  height: 1px;
  opacity: 0;
  background-image: url("../../assets/images/musicParty2020/switch_left@2x.png"),
    url("../../assets/images/musicParty2020/switch_right@2x.png");
  background-repeat: no-repeat;
}
.to-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);

  .select-party {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 976px;
    width: 386px;
    height: 56px;
  }
  .container {
    position: relative;
    width: 10rem;
    height: 100%;
    margin: 0 auto;
  }
}
.to-stage {
  position: absolute;
  bottom: 0;
  width: 375px;
  height: 885px;
  background-repeat: no-repeat;
  background-size: 100%;
  transition: transform 0.4s ease-in-out;

  &.left {
    left: 0;
    background-image: url("../../assets/images/musicParty2020/switch_left@2x.png");
  }
  &.right {
    right: 0;
    background-image: url("../../assets/images/musicParty2020/switch_right@2x.png");
  }
  &.deactivated {
    transform: translateY(5%) scale(0.9, 0.9);
  }
  &.activated {
    transform: scale(1.15, 1.15);
  }
}

// vue动画效果
.fade-enter-active,
.fade-leave-active {
  transition: background 0.32s linear;
  .to-stage.left {
    transition-duration: 0.35s;
  }
  .to-stage.right {
    transition-duration: 0.43s;
  }
}
.fade-enter-from,
.fade-leave-to {
  background-color: rgba(0, 0, 0, 0);
  .to-stage {
    transform: translateY(100%);
  }
}

</style>
