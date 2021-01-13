<template>
  <popup-view :visible="visible" @close="closeView">
    <div class="container">
      <p class="title">助力成功！</p>
      <p class="tips">您的好友获得了一次抽奖机会</p>
      <div class="icon-aha"></div>
      <button class="button-link" @click="linkTo()">
        创作专属我的节日单曲
      </button>
      <p class="tips2">制作完音乐后，您也可以参与抽奖活动</p>
    </div>
  </popup-view>
</template>

<script>
import PopupView from "@components/PopupView.vue";

export default {
  components: {
    PopupView,
  },
  props: {
    visible: Boolean,
  },
  emits: ['update:visible'],
  setup(props, context) {
    const closeView = () => {
      context.emit('update:visible', false);
    }
    const linkTo = () => {
      console.log('linkTo');
    }
    /* router.push({
      path: "/musicParty/home",
      query: { ...this.$route.query, share_key: undefined },
    }); */
    return {
      closeView,
      linkTo,
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  text-align: center;
  padding-top: 36px;
  padding-bottom: 30px;
  width: 630px;
  .title {
    line-height: 50px;
    margin-bottom: 20px;
    font-size: 36px;
    font-weight: 600;
    color: #333333;
  }
  .tips {
    line-height: 40px;
    margin-bottom: 5px;
    font-size: 28px;
    color: #9e9e9e;
  }
  .icon-aha {
    width: 272px;
    height: 272px;
    margin: 0 auto 21px;
    background: url("../../../assets/images/musicParty2020/other/ico_aha_haha@2x.png") 0 0 no-repeat;
    background-size: 100%;
  }
  .button-link {
    width: 536px;
    height: 102px;
    margin-bottom: 30px;
    font-size: 32px;
    font-weight: 500;
    border-radius: 54px;
    color: #ffffff;
    border: 2px solid #ffffff;
    background-color: #fd5e02;
  }
  .tips2 {
    line-height: 30px;
    font-size: 22px;
    color: #9b9b9b;
  }
}
</style>