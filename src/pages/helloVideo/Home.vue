<template>
  <video-demo
    v-model:fullScreen="fullScreen"
    title="第一节四五第一节九十第二节四五第二节九十第三节四五"
    sources="http://test001.pnlyy.com/mb/0orrjpxjfTvIibv3M7bnjH9h2bfeZUtJL1.mp4"
    thumb="http://test001.pnlyy.com/FbZ0e1kGNoylzTZ831bRA9P8aOIklL5dwaterMark.jpg"
    :timeline="timeline"
    @progress="viewQuestions"
  >
    <template #mask="{ portrait }">
      <interaction
        :portrait="portrait"
        :questions="inclusion"
        @complete="resolveCallback"
        @abort="rejectCallback"
      >
      </interaction>
    </template>
    <template #end>
      <popover-end @close="closeVideo()" @reset="resetVideo()"> </popover-end>
    </template>
  </video-demo>
  <div> <br/>说明：带有交互式的视频组件Demo，同时处理横竖屏问题，点击图片进入体验。</div>
</template>

<script>
import { reactive, toRefs, nextTick, readonly } from "vue";
import VideoDemo from "./components/HelloVideo.vue";
import Interaction from "./components/Interaction.vue";
import PopoverEnd from "./components/PopoverEnd.vue";
import inclusionTest from './test.json'
import inclusionTest2 from './test2.json'

export default {
  components: {
    VideoDemo,
    Interaction,
    PopoverEnd,
  },
  setup(props) {
    const data = reactive({
      fullScreen: false,
      inclusion: [],
      timeline: [10, 110],
      resolveCallback: () => {},
      rejectCallback: () => {},
    });

    const viewQuestions = (currentTime, resolve, reject) => {
      if (currentTime == 10) {
        data.inclusion = readonly(inclusionTest);
      }
      if (currentTime >= 110) {
        data.inclusion = readonly(inclusionTest2);
      }
      data.resolveCallback = resolve;
      data.rejectCallback = reject;
    };

    const closeVideo = () => {
      data.fullScreen = false;
    };
    const resetVideo = () => {
      data.fullScreen = false;
      nextTick(() => {
        data.fullScreen = true;
      });
    };

    return {
      ...toRefs(data),
      closeVideo,
      resetVideo,
      viewQuestions,
    };
  },
};
</script>