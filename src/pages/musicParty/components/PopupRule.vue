<template>
  <popup-view :visible="visible" @close="closeView" @open="initScroll">
    <div class="title">活动规则</div>
    <div class="content" ref="wrapper">
      <div>
        <p>
          1.活动期间，用户在第一次完成音乐创作后可免费获得3次抽奖机会，同时用户可通过邀请好友助力获得额外抽奖机会。
        </p>
        <p>2.每位用户在活动期间仅可帮助一位好友助力成功。</p>
        <p>3.每位用户每天（00:00-24:00）的抽奖次数上限为8次。</p>
        <p>
          4.好友助力的次数不设上限，若助力次数大于每天抽奖的上限次数，则助力产生的抽奖机会会向后分摊到每个活动日，直至活动结束或助力次数耗尽。
        </p>
        <p>
          5.用户活动期间的音乐创作次数不设上限，但最终只能保存最新一次的音乐作品。
        </p>
        <p>
          6.活动奖品包括：Apple AirPods
          Pro耳机、无线蓝牙音箱家用户外小音响、JACKBYE
          板材太阳镜、飞利浦料理机、舒客声波电动牙刷、VIP陪练定制-美人鱼硅胶笔、好丽友薯愿、VIP陪练定制书包、24色彩铅笔、VIP陪练定制戴帽子U型枕头、VIP陪练精品课全场5折扣券。
        </p>
        <p>
          7.实物奖品发放：获奖用户可通过中奖页面或中奖纪录页面领取并填写完整收货信息，奖品将于活动结束后30个工作日内统一发放。如中奖用户在活动结束前未填写完整收货信息将视为放弃奖品领取权益。目前仅支持中国大陆境内快递邮寄，为确保礼品准确送达，请您填写国内地址。
        </p>
        <p>
          8.VIP陪练精品课全场5折扣券：获奖用户可通过中奖页面或我的中奖纪录页面自行完成折扣券领取，折扣券有效期为领取当日起31天内有效。
        </p>
        <p>
          9.如果用户以任何不正当手段或舞弊方式参与本活动，一经发现，VIP陪练有权对该用户的账号进行异常标记。对于账号异常的用户的奖励发放，VIP陪练有权采取发优惠券、不发放奖励、撤销剩余奖励等措施，亦有权收回用户可领取的金额、实物等奖励，追讨已发放的金额、实物等奖励，并保留追究该用户责任的权利。如因此给用户造成损失，VIP陪练不进行任何赔偿或补偿。不正当手段及舞弊行为包括但不限于：使用非法工具分享、下载、安装、注册、登陆多个账号及其他不正当手段。
        </p>
        <p>
          10.如果用户存在违规行为（包括但不限于洗钱、虚假交易、赌博、恶意套现、作弊、刷信誉），VIP陪练将取消用户的活动资格、并有权撤销相关违规交易、收回奖励等利益，同时依靠相关规则进行。
        </p>
        <p>
          11.如因不可抗力或情势变更（包括但不限于重大自然灾害事件、政府主管部门指令停止举办或调整、活动遭受严重网络攻击或系统故障等）导致本活动无法继续举办的，则VIP陪练可决定暂停或终止本活动，并可依相关法律法规的规定主张免责。
        </p>
        <p>12.所有活动及商品均与苹果公司（Apple Inc.）无关。</p>
        <p>13.VIP陪练在法律允许范围内享有对此活动的最终解释权。</p>
      </div>
    </div>
    <div class="footer">
      <div class="button" @click="closeView()">我知道了</div>
    </div>
  </popup-view>
</template>

<script>
import { ref } from 'vue'
import PopupView from "@components/PopupView.vue";
import BScroll from "better-scroll";

export default {
  components: {
    PopupView,
  },
  props: {
    visible: Boolean,
  },
  emits: ['update:visible'],
  setup(props, context) {
    const scrollWrap = null;
    const wrapper = ref(null);
    const closeView = () => {
      context.emit('update:visible', false);
    }
    const initScroll = () => {
      if (!scrollWrap) {
        scrollWrap = new BScroll(wrapper.value, {});
      }
    }

    return {
      closeView,
      initScroll,
      wrapper
    }
  }
}
</script>
<style lang="scss" scoped>
.title,
.footer {
  text-align: center;
}
.title {
  height: 130px;
  line-height: 130px;
  font-size: 36px;
  font-weight: 600;
  color: #333333;
}
.content {
  overflow: hidden;
  padding: 0 35px;
  width: 650px;
  height: 552px;
  line-height: 40px;
  font-size: 24px;
  color: #4a4a4a;
}
.footer {
  padding: 30px 50px;
  .button {
    height: 100px;
    line-height: 100px;
    border-radius: 50px;
    font-size: 32px;
    font-weight: 600;
    color: #ffffff;
    background-color: #fd5e02;
    &:active {
      opacity: 0.9;
    }
  }
}
</style>