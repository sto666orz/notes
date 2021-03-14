<template>
  <div 
    class="hello-video"
    ref="helloScreenRef"
    :style="`font-size: ${fontSize}px`"
  >
    <div class="hello-thumb" @click="tryFullScreen()">
      <img :src="thumb" class="thumb-cover" />
      <img
        src="../../../assets/images/classPackage/video/icon_play@2x.png"
        class="thumb-play"
      />
    </div>
    <!-- 强行横屏视频 -->
    <div
      v-if="fullScreen"
      class="hello-screen"
      @touchstart="sandClockControl()"
      @touchmove="sandClockControl()"
      @touchend="sandClockControl()"
    >
      <div class="matches-screen" :style="matchesStyle">
        <section class="video-background" @click="toggleControl">
          <video
            :src="sources"
            ref="videoRef"
            :width="helloVideo.portrait ? helloVideo.height : helloVideo.width"
            :height="helloVideo.portrait ? helloVideo.width : helloVideo.height"
            x-webkit-airplay="true"
            x5-playsinline="true"
            webkit-playsinline="true"
            playsinline="true"
          >
            您的浏览器版本太低,不支持播放视频
          </video>
        </section>
        <header class="hello-header" :class="{ 'is-hide': control.hidden }">
          <i class="btn-back" @click="closeVideo()"></i>
          <span class="title">{{ title }}</span>
        </header>
        <footer class="hello-control" :class="{ 'is-hide': control.hidden }">
          <i
            class="btn-play"
            :class="{ 'is-pause': !control.playing }"
            @click="togglePlay"
          ></i>
          <div class="control-main">
            <p class="play-time">{{ formatSeconds(control.currentTime)}}</p>
            <div class="control-progress">
              <div
                class="progress-over"
                :style="`width: ${progress.position}%`"
              ></div>
              <template v-if="!control.hidden && control.totalTime > 0">
                <div
                  v-for="(time, index) in timeline"
                  :key="time"
                  class="progress-flag"
                  :class="{
                    'is-pass': progress.passedTime >= time,
                    'is-move': progress.isMoved,
                  }"
                  :style="`left: ${getProgressPercent(time)}%`"
                >
                  <div class="flag-number">
                    <p class="flag-number-text">{{ index + 1 }}</p>
                  </div>
                </div>
              </template>
              <div
                class="progress-current"
                :style="`left: ${progress.position}%`"
                @touchstart="startMoveProgress"
                @touchmove="moveProgress"
                @touchend="endMoveProgress"
              >
                <i
                  class="progress-current-point"
                  :class="{ 'is-move': progress.isMoved }"
                ></i>
              </div>
            </div>
            <p class="play-total">{{ formatSeconds(control.totalTime) }}</p>
          </div>
        </footer>

        <div v-show="control.loading" class="hello-pop-mask">
          <img
            class="loading-icon"
            src="../../../assets/images/loading-icon.svg"
            alt=""
          />
          <p class="loading-text">缓冲中...</p>
        </div>
        <div v-if="control.isError" class="hello-pop-mask">
          <p class="loading-text">视频加载失败</p>
        </div>

        <follow-toast v-model:toast="toast"></follow-toast>
      </div>
    </div>

    <transition name="slide">
      <div class="hello-screen" v-if="inPassProgress">
        <div class="matches-screen" :style="matchesStyle">
          <slot name="mask" :portrait="helloVideo.portrait"></slot>
        </div>
      </div>
    </transition>

    <div class="hello-screen" v-if="isPlayEnd">
      <div class="matches-screen" :style="matchesStyle">
        <slot name="end" :currentTime="control.currentTime"></slot>
      </div>
    </div>
  </div>
</template>


<script>
import {
  ref,
  reactive,
  toRefs,
  computed,
  nextTick,
  onBeforeUnmount,
  watch,
} from "vue";

import FollowToast from "./FollowToast.vue";
import { formatSeconds } from "../util/timeTranslate";
import { requestFullscreen, exitFullscreen } from "../util/fullScreen";

function defaultControl(control) {
  control.hidden = false; // 是否隐藏控制条
  control.totalTime = 0; // 视频总时长
  control.currentTime = 0; // 当前播放时间
  control.loading = false; // 视频加载中
  control.playing = false; // 视频播放中
  control.isError = false; // 加载错误
  control.hideClock = null; // 自动隐藏的时钟
  return control;
}
function defaultProgress(progress) {
  progress.lastTouchesX = 0; // 最后位置
  progress.lastTouchesY = 0;
  progress.isMoved = false; // 拖动中
  progress.position = 0; // 当前位置 百分比
  progress.passedTime = -1; // 最高已经通过的时间
  progress.nextTime = -1; // 抵达下个视频节点的时间
  return progress;
}

export default {
  components: {
    FollowToast,
  },
  props: {
    fullScreen: Boolean, // 全屏显示
    // "http://test001.pnlyy.com/mb/0orrjpxjfTvIibv3M7bnjH9h2bfeZUtJL1.mp4"
    sources: {
      type: String,
      required: true,
    },
    timeline: {
      type: Array,
      required: true,
    },
    title: String, // 视频名
    thumb: String, // 封面图
  },
  emits: [
    "update:fullScreen",
    "initVideo",
    "closeVideo",
    "progress",
    "timeupdate",
    "durationchange",
    "allpass",
  ],
  setup(props, context) {
    const data = reactive({
      meetThePlay: false, // 满足APP播放条件
      helloVideo: {
        width: 0,
        height: 0,
        portrait: true, // 是否竖屏
      },
      inPassProgress: false, // 正在显示节点内容
      isPlayEnd: false, // 是否播放完毕
      toast: '',  //提示文本
    });

    const control = reactive({
      hidden: false, // 是否隐藏控制条
      totalTime: 0, // 视频总时长
      currentTime: 0, // 当前播放时间
      loading: false, // 视频加载中
      playing: false, // 视频播放中
      isError: false, // 加载错误
      hideClock: null, // 自动隐藏的时钟
    });

    const progress = reactive({
      lastTouchesX: 0, // 最后位置
      lastTouchesY: 0,
      isMoved: false, // 拖动中
      position: 0, // 当前位置 百分比
      passedTime: -1, // 最高已经通过的时间
      nextTime: -1, // 抵达下个视频节点的时间
    });

    const matchesStyle = computed(() => {
      return data.helloVideo.portrait
        ? {
            width: data.helloVideo.height + "px",
            height: data.helloVideo.width + "px",
          }
        : {
            width: data.helloVideo.width + "px",
            height: data.helloVideo.height + "px",
          };
    });

    const fontSize = computed(() => {
      const width = data.helloVideo.width;
      const height = data.helloVideo.height;
      return data.helloVideo.portrait ? height / 10 : width / 10;
    });

    // 下一个节点的时间
    const nextPassTime = computed(() => {
      const nextTime = progress.nextTime;
      const timeline = props.timeline;
      const time = timeline.find((time) => time > nextTime);
      return typeof time === "number" ? time : -1;
    });

    // 最高通过时间
    const maxPassTime = computed(() => {
      const passedTime = progress.passedTime;
      const timeline = props.timeline;
      const time = timeline.find((time) => time > passedTime);
      return typeof time === "number" ? time : -1;
    });

    /** @type {{ value: HTMLVideoElement }} */
    const videoRef = ref(null);
    /** @type {{ value: HTMLDivElement }} */
    const helloScreenRef = ref(null);

    function tryFullScreen() {
      if (!props.fullScreen && props.sources) {
        context.emit("update:fullScreen", true);
      }
      // 尝试浏览器原生全屏功能(IOS不支持)
      nextTick(() => {
        requestFullscreen(helloScreenRef.value);
      });
    }

    function initVideo() {
      defaultControl(control);
      defaultProgress(progress);
      control.loading = true;
      nextTick(() => {
        loadRefs();
        sandClockControl();
      });
      context.emit("initVideo");
    }

    // 初始化视频和画布资源
    function loadRefs() {
      const video = videoRef.value;
      // requestAnimationFrame接近60帧 所以0.3秒更新一次已经够了
      const throttleMax = 20;
      // 节流标记 进度条等不需要这么高的更新频率
      let throttle = throttleMax;
      // 视频播放轮询
      const playingLoop = () => {
        if (++throttle % throttleMax === 0) {
          throttle = 1;
          // 更新当前播放时间
          const currentTime = Math.floor(video.currentTime);
          if (currentTime !== control.currentTime) {
            control.currentTime = currentTime;
            context.emit("timeupdate", currentTime);
          }
          // 绘制进度条
          if (!progress.isMoved) {
            progress.position = getProgressPercent(currentTime);
          }
          // 通知答题开始
          if (!control.loading) {
            checkNotifyNode();
          }
        }
        if (!video.ended && !video.paused) {
          window.requestAnimationFrame(playingLoop);
        }
      };

      const loadedmetadata = (event) => {
        control.loading = false;
        video.play();
        if (video.muted) {
          video.muted = false;
        }
      };
      const loaderror = (event) => {
        console.log("loaderror");
        control.loading = false;
      };
      const durationchange = (event) => {
        control.totalTime = Math.floor(video.duration);
        context.emit("durationchange", video.duration);
      };
      const videoplay = (event) => {
        control.playing = true;
        window.requestAnimationFrame(playingLoop);
      };
      const videopause = (event) => {
        console.log("videopause");
        control.playing = false;
      };
      const videoended = (event) => {
        data.isPlayEnd = true;
      };
      const videowaiting = (event) => {
        control.loading = true;
      };
      const canplaythrough = (event) => {
        control.loading = false;
        window.requestAnimationFrame(playingLoop);
      };

      video.addEventListener("loadedmetadata", loadedmetadata);
      video.addEventListener("durationchange", durationchange);
      video.addEventListener("canplaythrough", canplaythrough);
      video.addEventListener("error", loaderror);
      video.addEventListener("play", videoplay);
      video.addEventListener("pause", videopause);
      video.addEventListener("ended", videoended);
      video.addEventListener("waiting", videowaiting);

      /* onBeforeUnmount(() => {
        video.removeEventListener("loadedmetadata", loadedmetadata);
        video.removeEventListener("durationchange", durationchange);
        video.removeEventListener("canplaythrough", canplaythrough);
        video.removeEventListener("error", loaderror);
        video.removeEventListener("play", videoplay);
        video.removeEventListener("pause", videopause);
        video.removeEventListener("ended", videoended);
        video.removeEventListener("waiting", videowaiting);
      }); */
    }

    // 播放或暂停
    function togglePlay() {
      const video = videoRef.value;
      if (!checkNotifyNode()) {
        control.playing ? video.pause() : video.play();
      }
      // IOS监听在父级监听click 会使触摸事件变的难用 所以在独立事件中进行阻止
      sandClockControl();
    }

    // 结束播放关闭全屏
    function closeVideo() {
      context.emit("update:fullScreen", false);
      context.emit("closeVideo");
      const video = videoRef.value;
      if (!video.paused) {
        video.pause();
      }
    }

    // 控制条显示隐藏
    function toggleControl() {
      control.hidden = !control.hidden;
    }

    // 检查并通知显示时间节点slot
    function checkNotifyNode() {
      const video = videoRef.value;
      const passTime = nextPassTime.value;

      if (passTime >= 0 && control.currentTime >= passTime) {
        video.pause();
        new Promise((resolve, reject) => {
          data.inPassProgress = true;
          context.emit("progress", passTime, resolve, reject);
        })
          .then(() => {
            // 处理事件后才能继续播放
            if (passTime > progress.passedTime) {
              progress.passedTime = passTime;
            }
            progress.nextTime = passTime;
            // 没有下个节点了, 代表学完
            if (nextPassTime.value < 0) {
              context.emit("allpass");
            }
            video.play();
          })
          .catch(() => {
            // 就暂停在这里还是关闭视频
          })
          .finally(() => {
            data.inPassProgress = false;
          });
        return true;
      }
      return false;
    }
    /**
     * 移动进度条
     * @param {TouchEvent} event
     */
    function startMoveProgress(event) {
      progress.isMoved = true;
      const touches = event.touches[0];
      progress.lastTouchesX = touches.clientX;
      progress.lastTouchesY = touches.clientY;
      // PRD: 拖动进度条会暂停视频播放
      if (control.playing) {
        videoRef.value.pause();
      }

      // IOS监听在父级监听click 会使触摸事件变的难用 所以在独立事件中进行阻止
      sandClockControl(0); // 部分手机会传播touch事件 所以此处不一定奏效 但先这样
    }
    /** @param {TouchEvent} event */
    function moveProgress(event) {
      // 视频没有时间时无法拖动
      if (control.totalTime <= 0) return;

      const touches = event.touches[0];

      let moveX = progress.lastTouchesX - touches.clientX;
      let moveY = progress.lastTouchesY - touches.clientY;

      progress.lastTouchesX = touches.clientX;
      progress.lastTouchesY = touches.clientY;

      const minPercent = 0;
      const maxPercent =
        maxPassTime.value >= 0 ? getProgressPercent(maxPassTime.value) : 100;
      let position = progress.position;
      position -=
        (data.helloVideo.portrait
          ? moveY / data.helloVideo.height
          : moveX / data.helloVideo.width) * 100;
      position = Math.max(position, minPercent);
      position = Math.min(position, maxPercent);
      progress.position = position;
    }

    /** @param {TouchEvent} event */
    function endMoveProgress(event) {
      // console.log('endMoveProgress', event);
      progress.isMoved = false;
      if (control.totalTime <= 0) return;
      let currentTime = (progress.position / 100) * control.totalTime;
      let integerTime = Math.floor(currentTime);
      // 互动节多划点零点几秒误差修正
      const timeline = props.timeline;
      const findIndex = timeline.findIndex((time) => time === integerTime);
      if (findIndex >= 0) {
        currentTime = integerTime;
      }

      const video = videoRef.value;
      video.currentTime = currentTime;
      control.currentTime = video.currentTime;
      progress.nextTime = video.currentTime - 0.01;
      progress.position = getProgressPercent(integerTime);

      // PRD: 拖到下个节点要给个提示
      const maxTime = maxPassTime.value;
      const maxPercent = maxTime >= 0 ? getProgressPercent(maxTime) : 100;
      if (maxTime >= 0 && progress.position >= maxPercent) {
        data.toast = '请先完成本练习，才能学习后面的内容';
      }
      // IOS监听在父级监听click 会使触摸事件变的难用 所以在独立事件中进行阻止
      sandClockControl();
    }
    // 获取时间对应的百分比
    function getProgressPercent(currentTime) {
      let totalTime = control.totalTime;
      if (totalTime <= 0) {
        return 0;
      }
      let percent = (currentTime / totalTime) * 100;
      return percent < 100 ? Number(percent.toFixed(4)) : 100;
    }
    // 重置自动隐藏控制条 ms
    function sandClockControl(resetTime = 5000) {
      if (control.hideClock !== null) {
        clearTimeout(control.hideClock);
        control.hideClock = null;
      }
      if (resetTime > 0) {
        // 五秒没操作自动隐藏
        control.hideClock = setTimeout(() => {
          control.hidden = true;
        }, resetTime);
      }
    }

    // created
    const changeWindowHeight = () => {
      // IOS触发事件时拿到的屏幕大小不一定准确, 必须延迟几毫秒
      setTimeout(() => {
        // body最高宽度768 导致无法全屏 所以用window宽度
        data.helloVideo.width = window.outerWidth || document.body.clientWidth;
        data.helloVideo.height =
          window.outerHeight || document.body.clientHeight;
      }, 10);
    };

    let lastVideoTime = -1;
    const visibilitychange = () => {
      const video = videoRef.value;
      if (!video) return;
      if (document.hidden) {
        video.pause();
        lastVideoTime = video.currentTime;
      } else if (lastVideoTime >= 0 && video.currentTime !== lastVideoTime) {
        video.currentTime = lastVideoTime;
      }
    };
    const onMatchMediaChange = (MediaQueryListEvent) => {
      data.helloVideo.portrait = MediaQueryListEvent.matches;
    };
    // 进入后台事件
    document.addEventListener("visibilitychange", visibilitychange);
    // 大小改变事件
    window.addEventListener("resize", changeWindowHeight);
    // 方向改变事件
    const orientation = window.matchMedia("(orientation: portrait)");
    orientation.addListener(onMatchMediaChange);
    // 事件注销
    onBeforeUnmount(() => {
      window.removeEventListener("resize", changeWindowHeight);
      document.removeEventListener("visibilitychange", visibilitychange);
      orientation.removeListener(onMatchMediaChange);
    });
    // 初始化执行
    changeWindowHeight();
    onMatchMediaChange(orientation);
    // 如果默认就是全屏则直接初始化
    if (props.fullScreen && props.sources) {
      initVideo();
    }

    watch(() => props.fullScreen, (val) => {
      // 执行一些清理操作
      if (!val) {
        data.isPlayEnd = false;
        data.inPassProgress = false;
        exitFullscreen();
      } else {
        initVideo();
      }
    });

    return {
      ...toRefs(data),
      control,
      progress,
      videoRef,
      helloScreenRef,
      // computed
      matchesStyle,
      fontSize,
      nextPassTime,
      maxPassTime,
      // methods
      tryFullScreen,
      togglePlay,
      closeVideo,
      toggleControl,
      startMoveProgress,
      moveProgress,
      endMoveProgress,
      getProgressPercent,
      sandClockControl,
      formatSeconds,
    };
  },
};
</script>

<style lang="scss" scoped>
.hello-video {
  line-height: 1;
  user-select: none;
}
.hello-thumb {
  position: relative;
  height: 100%;
  background-color: #30313b;
  .thumb-cover {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
  .thumb-play {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.693333em;
    height: 0.693333em;
    transform: translate(-50%, -50%);
  }
}
.hello-screen {
  overflow: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 199;
  transform: translateZ(0);

  .video-background {
    background-color: #434343;
  }

  .hello-pop-mask {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0.25em 0.5em;
    border-radius: 0.2em;
    background-color: rgba(0, 0, 0, 0.1);
    .loading-icon {
      display: block;
      margin: 0 auto 0.15em;
    }
    .loading-text {
      font-size: 0.2em;
      color: #ffffff;
    }
  }
}

// 按钮基础
@mixin btn-base($image, $width, $height) {
  width: $width;
  height: $height;
  background: url("../../../assets/images/classPackage/video/#{$image}") center
    center no-repeat;
  background-size: 100%;
}
@mixin nav-base($direction, $height) {
  position: absolute;
  #{$direction}: 0;
  left: 0;
  right: 0;
  text-align: center;
  height: $height;
  line-height: $height;
  color: #ffffff;
  transition: all 0.33s ease-out;
  &.is-hide {
    #{$direction}: -$height;
  }
}

.hello-header {
  @include nav-base(top, 0.853333em);
  .title {
    display: block;
    font-size: 0.266667em;
  }
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  .btn-back {
    $width: 0.28em;
    position: absolute;
    top: 50%;
    left: 0.2em;
    margin-top: -$width / 2;
    @include btn-base("icon_back.png", $width, $width);
  }
}
.hello-control {
  @include nav-base(bottom, 0.853333em);
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.6) 100%
  );
  .btn-play {
    $width: 0.36em;
    position: absolute;
    top: 50%;
    left: 0.2em;
    margin-top: -$width / 2;
    @include btn-base("icon_playing.png", $width, $width);
    &.is-pause {
      background-image: url("../../../assets/images/classPackage/video/icon_paused.png");
    }
  }
  .control-main {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0.78em;
    right: 0.28em;
    top: 1px;
    bottom: 0;
    touch-action: none;

    .play-time,
    .play-total {
      width: 3.4em;
      line-height: 0.146667em;
      font-size: 0.146667em;
      font-weight: 500;
      text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
    }
    .control-progress {
      position: relative;
      flex: 1;
      margin-left: 0.2em;
      margin-right: 0.2em;
      height: 0.133333rem;
      border-radius: 0.133333rem;
      background-color: rgba(0, 0, 0, 0.3);
    }
    .progress-over {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      border-radius: 0.133333rem;
      background-color: rgba(255, 255, 255, 0.8);
    }
    .progress-flag {
      $flag-width: 0.06em;
      position: absolute;
      bottom: 0;
      top: 0;
      // top: -0.15em;
      width: $flag-width;
      transform: translateX(-50%);
      background-color: #ffffff;
      .flag-number {
        display: none;
        position: absolute;
        bottom: 0.2em;
        width: 0.44em;
        height: 0.44em;
        margin-left: $flag-width / 2;
        transform: translateX(-50%);
        border: 0.04em solid #ffffff;
        border-radius: 100%;
        background-color: #7f7f7f;
        color: #ffffff;
        .flag-number-text {
          font-size: 0.16em;
          line-height: 2.3em;
        }
      }
      &.is-move {
        top: -0.15em;
        .flag-number {
          display: block;
        }
      }
      &.is-pass {
        // display: block;
        .flag-number {
          background-color: #fd5e02;
        }
      }
    }
    .progress-current {
      position: absolute;
      left: 0;
      top: 50%;
      $difference: 2%; //向右偏移一点 来造成拖动到节点视
      transform: translate(-50% + $difference, -50%);
      padding: 0.2em; // 增大触摸区域
      .progress-current-point {
        $point: 0.16em;
        display: block;
        width: $point;
        height: $point;
        border-radius: 100%;
        background-color: #fd5e02;
        box-shadow: 0 0 0.06em #fd5e02;
        transition: all 0.2s ease-in;
        &.is-move {
          width: $point + 0.1em;
          height: $point + 0.1em;
          // box-shadow: 0 0 0.06em #FD5E02;
        }
      }
    }
  }
}

.matches-screen {
  position: relative;
  transform-origin: top left;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.33s ease;
}

/*竖屏*/
@media only screen and (orientation: portrait) {
  .matches-screen {
    transform: rotate(90deg);
    right: -100%;
  }

  .slide-enter-from,
  .slide-leave-to {
    opacity: 0.5;
    transform: translateX(-100%);
  }
}
/*横屏*/
@media only screen and (orientation: landscape) {
  .matches-screen {
    transform: rotate(0deg);
  }

  .slide-enter-from,
  .slide-leave-to {
    opacity: 0.5;
    transform: translateY(100%);
  }
}
</style>