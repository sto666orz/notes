<template>
  <!-- <div class="background"></div> -->
  <div class="background">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
  <div class="wrapper">
    <div class="main">
      <a class="to-blog" href="https://bishaoxia.gitee.io" target="_blank">
        <Button icon="wap-home-o" type="primary">前往我的博客</Button>
      </a>
      <h5 class="title">【毕俊】随便的主页</h5>
      <h5 class="title-2">欢迎访问毕俊的小站，这是一个使用Vue3 + Vite构建的项目，目的是学习新的事物。</h5>
      <p class="text">
        学习最好的方法是动手，于是将以前的几个小项目使用Vue3进行了重构，尝鲜了compositionAPI，体会到了Vue3开发上的一些改变：</p>
      <br/>
      <Button 
        v-for="(item, index) in buttons" 
        :key="index"
        :type="item.type" 
        size="large"
        style="margin-bottom: 5px"
        @click="showSheet(item)"
      >
        查看{{item.name}}
      </Button>
    </div>
  </div>

  <div class="holder-bottom">
    <p class="tips">
      *推荐使用移动端进行体验<br />
      *首页没什么审美做的比较随意
    </p>
  </div>

  <action-sheet v-model:show="show" title="作品简介">
    <div class="sheet">
      <p class="title">{{current.name}}</p>
      <section class="section">
        <div class="left">介绍：</div>
        <div class="right">{{current.notes}}</div>
      </section>
      <section class="section">
        <div class="left">技术点：</div>
        <div class="right">{{current.content}}</div>
      </section>
    </div>
    <p class="center">
      <router-link :to="current.link">
        <Button type="primary">进入Demo</Button>
      </router-link>
    </p>
  </action-sheet>
</template>

<script>
import { ref, reactive, toRefs } from 'vue'
import { Button, ActionSheet } from "vant";

const buttons = [
  {
    type: 'warning',
    name: '音乐派对游戏',
    link: '/musicparty/home',
    notes: '这是一个音乐合成小游戏，将多个乐器组成一段合奏。合成后可以分享给他人聆听你的创作。',
    content: '音频部分使用howler进行合成，动画使用序列帧 + css的@keyframes进行控制'
  },
  {
    type: 'success',
    name: 'web视频交互组件',
    link: '/hellovideo/home',
    notes: '原生video封装的互动视频播放器，播放至指定但时间节点可以进行交互。',
    content: 'Android尝试使用全屏事件，但IOS不支持全屏事件，所以将web旋转90度做伪横屏处理'
  },
  {
    type: 'danger',
    name: '接音符游戏',
    link: '/thanksgive/home',
    notes: '一个接音符的小游戏，滑动底部控制小人左右移动。',
    content: '使用hilojs作为游戏引擎制作；保证不同屏幕尺寸下的公平性。'
  },
]

export default {
  components: {
    Button,
    ActionSheet
  },
  setup() {
    const data = reactive({ 
      show: false,
      current: {}
    });

    const showSheet = (item) => {
      data.current = item;
      data.show = true;
    }
    return {
      text: "text",
      show: ref(false),
      buttons: reactive(buttons),
      ...toRefs(data),
      showSheet,
    };
  },
};
</script>

<style lang="scss" src="./home.stand.scss" scoped>
</style>