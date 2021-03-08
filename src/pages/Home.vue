<template>
  <div class="background"></div>
  <div class="wrapper">
    <div class="main">
      <h5 class="title">【毕俊】的零散Demo展示</h5>
      <h5 class="title-2">欢迎访问毕俊的小站，这是一个使用Vue3 + Vite构建的项目。</h5>
      <p class="tips">推荐使用移动端进行访问</p>
      <p class="tips">
        也欢迎访问我的Blog
        <a href="https://bishaoxia.gitee.io" target="_blank">
          <Button type="primary">前往Blog</Button>
        </a>
      </p>
    </div>

    <router-link to="/musicparty/home">
      <Button type="primary">音乐合成游戏</Button>
    </router-link>
    <router-link to="/thanksgive/home">
      <Button type="success">接音符游戏</Button>
    </router-link>
    <router-link to="/hellovideo/home">
      <Button>web伪横屏视频</Button>
    </router-link>

    <action-sheet v-model:show="show" title="作品简介">
      <div class="content">内容</div>

      <router-link to="/hellovideo/home">
        <Button>查看Demo</Button>
      </router-link>
    </action-sheet>
  </div>
</template>

<script>
import { Button, ActionSheet } from "vant";
// import 'vant/lib/button/style';

export default {
  components: {
    Button,
    ActionSheet
  },
  setup() {
    return {
      text: "text",
    };
  },
};
</script>

<style lang="scss" scoped>
.background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fattachments.gfan.com%2Fforum%2F201503%2F23%2F205237dm9mft2ml2dlgl8l.jpg&refer=http%3A%2F%2Fattachments.gfan.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1617790598&t=1f70c37ea7ce1b9d36b9e6e5dfaaabd3") center center no-repeat;
    background-size: cover;
    z-index: -1;
  }
.wrapper {
  box-shadow: 0 0.3px 0.7px rgba(0, 0, 0, 0.126),
    0 0.9px 1.7px rgba(0, 0, 0, 0.179), 0 1.8px 3.5px rgba(0, 0, 0, 0.224),
    0 3.7px 7.3px rgba(0, 0, 0, 0.277), 0 10px 20px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);

  
}
.main {
  text-align: center;
  padding: 50px 10px 20px;
  .title {
    line-height: 60px;
    font-size: 45px;
    color: #2c3e50;
  }
  .title-2 {
    line-height: 60px;
    margin-bottom: 20px;
    font-size: 35px;
    color: #6a8bad;
  }
  .tips {
    font-size: 25px;
    color: #696969;
  }
}
/* .text {
  font-size: 20px;
  width: 375px;
  height: 200px;
  line-height: 200px;
  background-color: cadetblue;
} */
</style>