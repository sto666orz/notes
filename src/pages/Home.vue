<template>
    <div>
        <p class="text">{{ text }}</p>
        <router-link to="/musicparty/home">
          <Button>音乐游戏</Button>
        </router-link>
        <router-link to="/thanksgive/home">
          <Button>接音符游戏</Button>
        </router-link>
    </div>
</template>

<script>
import { Button } from 'vant';
// import 'vant/lib/button/style';

export default {
  components: {
    Button
  },
  setup() {
    return {
      text: 'text'
    }
  }
}

</script>

<style scoped>
.text {
  font-size: 20px;
  width: 375px;
  height: 200px;
  line-height: 200px;
  /* border: 1px solid red; */
  background-color: rosybrown;
}
</style>