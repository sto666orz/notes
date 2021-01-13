<template>
  <popup-view :visible="visible" @close="closeView">
    <div class="container">
      <p class="title">您尚未添加伴奏，确认要合成吗？</p>
      <div class="icon-aha"></div>
      <div class="buttons">
        <span class="apply" @click="notify('apply')">确认</span>
        <span class="cancel" @click="notify('cancel')">不，去添加</span>
      </div>
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
    visible: Boolean
  },
  emits: ['update:visible', 'apply', 'cancel'],
  setup(props, context) {
    const closeView = () => {
      context.emit('update:visible', false);
    }
    const notify = (event) => {
      context.emit(event, null);
      closeView();
    }

    return {
      notify,
      closeView,
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 62px;
  padding-bottom: 59px;
  width: 630px;
  .title {
    text-align: center;
    width: 561px;
    line-height: 50px;
    margin: 0 auto 13px;
    font-size: 36px;
    font-weight: 600;
    color: #333333;
  }
  .icon-aha {
    width: 272px;
    height: 272px;
    margin: 0 auto 20px;
    background: url("../../../assets/images/musicParty2020/other/ico_aha_oh@2x.png") 0 0 no-repeat;
    background-size: 100%;
  }
  .buttons {
    text-align: center;
    .apply,
    .cancel {
      // box-sizing: border-box;
      display: inline-block;
      width: 265px;
      height: 100px;
      line-height: 100px;
      border-style: solid;
      border-width: 1px;
      border-radius: 61px;
      font-size: 28px;
      font-weight: 500;
    }
    .apply {
      color: #4a4a4a;
      border-color: #cbcbcb;
      background-color: #ffffff;
    }
    .cancel {
      color: #ffffff;
      border-color: #fd5e02;
      background-color: #fd5e02;
      margin-left: 20px;
    }
  }
}
</style>
