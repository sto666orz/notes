<template>
  <transition :name="fromTheme">
    <div
      v-show="visible"
      :class="['load-wrap', fromTheme, firstView ? 'close-transform' : null]"
    >
      <div v-if="networkError">
        <div class="aha-error"></div>
        <p class="text">啊哦，网络好像不给力…</p>
        <button class="button-reset" @click="resetLoading()">重试</button>
      </div>
      <div v-else>
        <div class="sprites">
          <div class="animation"></div>
        </div>
        <p class="text">
          正在赶赴{{
            fromTheme === "christmas" ? "新年的欢乐广场" : "圣诞老人的小屋"
          }}...
        </p>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, watch } from 'vue';
import { ImagesRes, SoundsRes, preloadRes } from "../local/preloadRes";

export default {
  props: {
    theme: String,
    visible: Boolean,
  },
  emits: ['update:visible', 'completed', 'error'],
  setup(props, context) {
    // 每次打开时需要缓存主题
    const fromTheme = ref('');
    const toTheme = ref('');
    const networkError = ref(false);
    const firstView = ref(true);

    const completed = () => {
      firstView.value = false;
      context.emit('update:visible', false);
      context.emit('completed', toTheme);
    }

    const preload = () => {
      let timeout = false; // 是否已经执行

      const timer = setTimeout(() => {
        timeout = true;
        completed();
      }, 8000); // 产品说最长加载时间

      Promise.all([
        preloadRes.addSounds(SoundsRes[toTheme.value]),
        preloadRes.addImages(ImagesRes),
        preloadRes.addTicker(320 * 4), // 载入最短持续时间  320约为loading动画一次循环时间
      ]).then(() => {
        if (!timeout) {
          clearTimeout(timer);
          completed();
        }
      })
      .catch(() => {
        clearTimeout(timer);
        networkError.value = true;
        context.emit('error', null);
      });
    }

    const resetLoading = () => {
      networkError.value = false;
      preload();
    }

    const setTheme = () => {
      fromTheme.value = props.theme;
      toTheme.value = props.theme === "christmas" ? "newyear" : "christmas";
      resetLoading();
    }

    watch(() => props.visible, (val) => {
      if (val) {
        setTheme();
      }
    }, {
      immediate: true
    });

    return {
      ...props,
      fromTheme,
      toTheme,
      networkError,
      firstView,
      resetLoading,
    }
  }
}
</script>

<style lang="scss" scoped>
.load-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  z-index: 99;
  &.newyear {
    background-color: #991627;
  }
  &.christmas {
    background-color: #96d5e5;
  }

  .sprites {
    width: 230px;
    height: 230px;
    margin: 0 auto 32px;
  }
  .text {
    text-align: center;
    width: 375px;
    line-height: 40px;
    font-size: 29px;
    color: #ffffff;
  }

  .aha-error {
    width: 272px;
    height: 272px;
    margin: 0 auto 45px;
    background: url("../../../assets/images/musicParty2020/other/ico_aha_sleep@2x.png") 0 0 no-repeat;
    background-size: 100%;
  }
  .button-reset {
    text-align: center;
    display: block;
    width: 236px;
    height: 102px;
    margin: 67px auto 0;
    border-radius: 54px;
    font-size: 32px;
    font-weight: 500;
    color: #ffffff;
    background-color: #fd5e02;
  }
}

.animation {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background-image: url("../../../assets/images/musicParty2020/loading.png");
  background-size: 300% 300%;
  background-repeat: no-repeat;
  animation-name: keyframes-base;
  animation-duration: 0.32s;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  animation-timing-function: steps(1);
}

@keyframes keyframes-base {
  0% {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    background-size: 300% 300%;
  }

  12.50% {
    background-position: 50% 0%;
  }

  25.00% {
    background-position: 0% 50%;
  }

  37.50% {
    background-position: 50% 50%;
  }

  50.00% {
    background-position: 100% 0%;
  }

  62.50% {
    background-position: 100% 50%;
  }

  75.00% {
    background-position: 0% 100%;
  }

  87.50%,
  100% {
    background-position: 50% 100%;
  }
}

$durationTime: 0.33s; // 动画持续时间
.christmas-enter-active,
.christmas-leave-active,
.newyear-enter-active,
.newyear-leave-active {
  transition: transform $durationTime ease-in-out;
}
.christmas-enter-from,
.christmas-leave-to {
  transform: translateX(100%);
}
.newyear-enter-from,
.newyear-leave-to {
  transform: translateX(-100%);
}

.close-transform {
  transition: opacity $durationTime linear !important;
}
</style>