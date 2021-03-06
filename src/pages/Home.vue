<template>
  <div>
    <div class="main">
      <h5 class="title">【毕俊】的零散作品展示</h5>
      <h5 class="title-2">这是一个使用Vue3 + Vite构建的项目</h5>
      <p class="tips">推荐使用移动端进行访问</p>
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