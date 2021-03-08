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
      <h5 class="title">【毕俊】的零散Demo</h5>
      <h5 class="title-2">欢迎访问毕俊的小站，这是一个使用Vue3 + Vite构建的项目。</h5>
      <p class="text">
        <span class="bold">做这个的目的？</span>
        学习最好的方法是动手，于是将以前的项目使用Vue3进行了重构，尝鲜了vue3 compositionAPI，体会到了Vue3的改变。</p>
      <br/>

      <Button 
        v-for="(item, index) in buttons" 
        :key="index"
        :type="item.type" 
        style="width:80%"
        @click="showSheet(item)"
      >
        查看{{item.name}}
      </Button>

    </div>
  </div>

  <div class="holder-bottom">
    <p>
      <a href="https://bishaoxia.gitee.io" target="_blank">
        <Button type="primary" size="mini">也欢迎访问我的博客（点我访问）</Button>
      </a>
    </p>
    <p class="tips">
      *推荐使用移动端进行体验<br />
      *首页符合格子衫程序员的审美
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
// import 'vant/lib/button/style';

const buttons = [
  {
    type: 'warning',
    name: '音乐拼图游戏',
    link: '/musicparty/home',
    notes: '这是一个音乐合成小游戏，将多个乐器组成一段合奏。',
    content: '使用了howler进行音频合成'
  },
  {
    type: 'success',
    name: '接音符游戏',
    link: '/thanksgive/home',
    content: '一个接音符的小游戏。<br/>技术点：使用hilojs + canvas进行制作；保证不同屏幕尺寸下的公平性'
  },
  {
    type: 'danger',
    name: 'web伪横屏视频',
    link: '/hellovideo/home',
    content: '介绍：原生video封装的互动视频播放器，含有指定时间节点进行交互。<br/>技术点：Android尝试使用全屏事件，IOS进行旋转90度伪横屏处理'
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

<style lang="scss" src="./anim.stand.scss">
</style>
<style lang="scss" src="./home.stand.scss" scoped>
</style>